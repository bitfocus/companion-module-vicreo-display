const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		status: {
			name: 'Forward',
			type: 'boolean',
			label: 'pressed right',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [{
				type: 'dropdown',
				label: 'status',
				choices: [{ id: 'right', label: 'pressed right'},{ id: 'left', label: 'pressed left'}],
				id: 'status',
				default: 'right',
			}],
			callback: (feedbacks) => {
				console.log('Feedback check')
				if (self.controlStatus === feedbacks.options.status) {
					return true
				} else {
					return false
				}
			},
		},
	})
}
