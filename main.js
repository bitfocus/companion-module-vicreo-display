const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
// const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
// const UpdateVariableDefinitions = require('./variables')

this.controlStatus = ''

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		// this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		// this.updateVariableDefinitions() // export variable definitions
		this.makeConnection()
	}
	
	makeConnection() {
		this.tcp = new TCPHelper(this.config.host, 3003, { timeout: 5000 })
		this.tcp.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
		this.tcp.on('connect', () => {
			this.log('info', 'connected')
		})
		this.tcp.on('data', async (data) => {
			console.log('incomming data', data.toString())
			try {
				let status = JSON.parse(data.toString())
				this.controlStatus = status.button
				console.log('status', this.controlStatus)
				this.checkFeedbacks('status')
				await new Promise(resolve => setTimeout(resolve, 500)) .then(() => { 
					this.controlStatus = ''
					this.checkFeedbacks('status')
				});
			} catch (error) {
				
			}
		})

		this.tcp.on('close', () => {
			this.log('info', 'Connection closed')
		})
		this.tcp.on('error', (err) => {
			this.log('info', err.toString())
		})
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		this.tcp.close()
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			}
		]
	}

	// updateActions() {
	// 	UpdateActions(this)
	// }

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	// updateVariableDefinitions() {
	// 	UpdateVariableDefinitions(this)
	// }
}

runEntrypoint(ModuleInstance, UpgradeScripts)
