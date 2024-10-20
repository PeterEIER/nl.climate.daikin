'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const airairhpctrl = require('../../lib/daikin');

// Driver for a Daikin Air2Air Heatpump type Airconditioner
class AirAirHPDriver extends Driver {

	onInit() {
		this.log('>>>onInit driver airairhp');
		super.onInit();

		this.deviceType = 'airairhp';

		//* ** TRIGGER FLOWCARDS *******************************************************************************************
		// --- Humidity flowcards
		/* ** TARGET Humidity TRIGGERS ** */
		this.triggerTargetHumidityMoreThan = this.homey.flow.getDeviceTriggerCard('change_target_humidity_more_than');
		this.triggerTargetHumidityMoreThan
			.registerRunListener((args, state) => {
				this.log('triggerTargetHumidityMoreThan fired');
				const conditionMet = state.target_humidity > args.target_humidity_more;
				// this.log('trigger - args.target_humidity_more', args.target_humidity_more);
				// this.log('trigger - state.target_humidity', (state.target_humidity) );
				// this.log('trigger - conditionMet', conditionMet);
				return conditionMet;
		});

		this.triggerTargetHumidityLessThan = this.homey.flow.getDeviceTriggerCard('change_target_humidity_less_than');
		this.triggerTargetHumidityLessThan
			.registerRunListener((args, state) => {
				this.log('triggerTargetHumidityLessThan fired');
				const conditionMet = state.target_humidity < args.target_humidity_less;
				return conditionMet;
		});

		this.triggerTargetHumidityBetween = this.homey.flow.getDeviceTriggerCard('change_target_humidity_between');
		this.triggerTargetHumidityBetween
			.registerRunListener((args, state) => {
				this.log('triggerTargetHumidityBetween fired');
				const conditionMet = state.target_humidity > args.target_humidity_from && state.target_humidity < args.target_humidity_to;
				return conditionMet;
		});

		// --- Temperature flowcards
		/* ** TARGET TEMPERATURE TRIGGERS ** */
		this.triggerTargetTemperatureMoreThan = this.homey.flow.getDeviceTriggerCard('change_target_temperature_more_than');
		this.triggerTargetTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('triggerTargetTemperatureMoreThan fired');
				const conditionMet = state.target_temperature > args.target_temperature_more;
				// this.log('trigger - args.target_temperature_more', args.target_temperature_more);
				// this.log('trigger - state.target_temperature', (state.target_temperature) );
				// this.log('trigger - conditionMet', conditionMet);
				return conditionMet;
		});

		this.triggerTargetTemperatureLessThan = this.homey.flow.getDeviceTriggerCard('change_target_temperature_less_than');
		this.triggerTargetTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('triggerTargetTemperatureLessThan fired');
				const conditionMet = state.target_temperature < args.target_temperature_less;
				return conditionMet;
		});

		this.triggerTargetTemperatureBetween = this.homey.flow.getDeviceTriggerCard('change_target_temperature_between');
		this.triggerTargetTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('triggerTargetTemperatureBetween fired');
				const conditionMet = state.target_temperature > args.target_temperature_from && state.target_temperature < args.target_temperature_to;
				return conditionMet;
		});

		/** * INSIDE TEMPERATURE TRIGGERS ** */
		this.triggerInsideTemperatureMoreThan = this.homey.flow.getDeviceTriggerCard('inside_temperature_more_than');
		this.triggerInsideTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('triggerInsideTemperatureMoreThan fired');
				const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_more;
				//this.log('trigger - args.inside_temperature_more', args.inside_temperature_more);
				//this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
				//this.log('trigger - conditionMet inside temp', conditionMet);
				return conditionMet;
		});

		this.triggerInsideTemperatureLessThan = this.homey.flow.getDeviceTriggerCard('inside_temperature_less_than');
		this.triggerInsideTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('triggerInsideTemperatureLessThan fired');
				const conditionMet = state['measure_temperature.inside'] < args.inside_temperature_less;
				return conditionMet;
		});

		this.triggerInsideTemperatureBetween = this.homey.flow.getDeviceTriggerCard('inside_temperature_between');
		this.triggerInsideTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('triggerInsideTemperatureBetween fired');
				const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_from && state['measure_temperature.inside'] < args.inside_temperature_to;
				return conditionMet;
		});

		/** * OUTSIDE TEMPERATURE TRIGGERS ** */
		this.triggerOutsideTemperatureMoreThan = this.homey.flow.getDeviceTriggerCard('outside_temperature_more_than');
		this.triggerOutsideTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('triggerOutsideTemperatureMoreThan fired');
				const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_more;
				// this.log('trigger - args.outside_temperature_more', args.outside_temperature_more);
				// this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
				// this.log('trigger - conditionMet outside temp', conditionMet);
				return conditionMet;
		});

		this.triggerOutsideTemperatureLessThan = this.homey.flow.getDeviceTriggerCard('outside_temperature_less_than');
		this.triggerOutsideTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('triggerOutsideTemperatureLessThan fired');
				const conditionMet = state['measure_temperature.outside'] < args.ouside_temperature_less;
				return conditionMet;
		});

		this.triggerOutsideTemperatureBetween = this.homey.flow.getDeviceTriggerCard('outside_temperature_between');
		this.triggerOutsideTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('triggerOutsideTemperatureBetween fired');
				const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_from && state['measure_temperature.outside'] < args.outside_temperature_to;
				return conditionMet;
		});

		/** * MODE CHANGE TRIGGER ** */
		this.triggerAircoMode = this.homey.flow.getDeviceTriggerCard('mode_changed');
		this.triggerAircoMode
			.registerRunListener((args, state) => {
				this.log('triggerAircoMode fired');
				const conditionMet = state.capability_mode === args.mode;
				//this.log('trigger - args.mode', args.mode);
				//this.log('trigger - state[capability_mode]', ( state['capability_mode']) );
				//this.log('trigger - conditionMet capability_mode', conditionMet);
				return conditionMet;
		});

		//* ** CONDITION FLOWCARDS *******************************************************************************************
		/* ** TARGET HUMIDITY CONDITIONS ** */
		this.conditionTargetHumidityMoreThan = this.homey.flow.getConditionCard('has_target_humidity_more_than');
		this.conditionTargetHumidityMoreThan
			.registerRunListener((args, state) => {
				this.log('conditionTargetHumidityMoreThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_humidity > args.target_humidity_more;
				// this.log('condition args.target_humidity_more', args.target_humidity_more);
				// this.log('condition devicestate.target_humidity', devicestate.target_humidity);
				// this.log('condition conditionMet', conditionMet);
				return conditionMet;
		});

		this.conditionTargetHumidityLessThan = this.homey.flow.getConditionCard('has_target_humidity_less_than');
		this.conditionTargetHumidityLessThan
			.registerRunListener((args, state) => {
				this.log('conditionTargetHumidityLessThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_humidity < args.target_humidity_less;
				return conditionMet;
		});

		this.conditionTargetHumidityBetween = this.homey.flow.getConditionCard('has_target_humidity_between');
		this.conditionTargetHumidityBetween
			.registerRunListener((args, state) => {
				this.log('conditionTargetHumidityBetween fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_humidity > args.target_humidity_from && devicestate.target_humidity < args.target_humidity_to;
				return conditionMet;
		});

		/* ** TARGET TEMPERATURE CONDITIONS ** */
		this.conditionTargetTemperatureMoreThan = this.homey.flow.getConditionCard('has_target_temperature_more_than');
		this.conditionTargetTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('conditionTargetTemperatureMoreThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_temperature > args.target_temperature_more;
				// this.log('condition args.target_temperature_more', args.target_temperature_more);
				// this.log('condition devicestate.target_temperature', devicestate.target_temperature);
				// this.log('condition conditionMet', conditionMet);
				return conditionMet;
		});

		this.conditionTargetTemperatureLessThan = this.homey.flow.getConditionCard('has_target_temperature_less_than');
		this.conditionTargetTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('conditionTargetTemperatureLessThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_temperature < args.target_temperature_less;
				return conditionMet;
		});

		this.conditionTargetTemperatureBetween = this.homey.flow.getConditionCard('has_target_temperature_between');
		this.conditionTargetTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('conditionTargetTemperatureBetween fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate.target_temperature > args.target_temperature_from && devicestate.target_temperature < args.target_temperature_to;
				return conditionMet;
		});

		/** * INSIDE TEMPERATURE CONDITIONS ** */
		this.conditionInsideTemperatureMoreThan = this.homey.flow.getConditionCard('has_inside_temperature_more_than');
		this.conditionInsideTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('conditionInsideTemperatureMoreThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_more;
				// this.log('condition - [measure_temperature.inside]', devicestate['measure_temperature.inside']);
				// this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
				// this.log('condition - conditionMet inside temp', conditionMet);
				return conditionMet;
		});

		this.conditionInsideTemperatureLessThan = this.homey.flow.getConditionCard('has_inside_temperature_less_than');
		this.conditionInsideTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('conditionInsideTemperatureLessThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.inside'] < args.inside_temperature_less;
				return conditionMet;
		});

		this.conditionInsideTemperatureBetween = this.homey.flow.getConditionCard('has_inside_temperature_between');
		this.conditionInsideTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('conditionInsideTemperatureBetween fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_from && devicestate['measure_temperature.inside'] < args.inside_temperature_to;
				return conditionMet;
		});

		/** * OUTSIDE TEMPERATURE CONDITIONS ** */
		this.conditionOutsideTemperatureMoreThan = this.homey.flow.getConditionCard('has_outside_temperature_more_than');
		this.conditionOutsideTemperatureMoreThan
			.registerRunListener((args, state) => {
				this.log('conditionOutsideTemperatureMoreThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_more;
				// this.log('condition - [measure_temperature.outside]', devicestate['measure_temperature.outside']);
				// this.log('condition - args.outside_temperature_more', args.outside_temperature_more);
				// this.log('condition - conditionMet outside temp', conditionMet);
				return conditionMet;
		});

		this.conditionOutsideTemperatureLessThan = this.homey.flow.getConditionCard('has_outside_temperature_less_than');
		this.conditionOutsideTemperatureLessThan
			.registerRunListener((args, state) => {
				this.log('conditionOutsideTemperatureLessThan fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.outside'] < args.outside_temperature_less;
				return conditionMet;
		});

		this.conditionOutsideTemperatureBetween = this.homey.flow.getConditionCard('has_outside_temperature_between');
		this.conditionOutsideTemperatureBetween
			.registerRunListener((args, state) => {
				this.log('conditionOutsideTemperatureBetween fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_from && devicestate['measure_temperature.outside'] < args.outside_temperature_to;
				return conditionMet;
		});

		/* ** MODE CHANGE CONDITIONS ** */
		this.conditionAircoMode = this.homey.flow.getConditionCard('mode_equals');
		this.conditionAircoMode
			.registerRunListener((args, state) => {
				this.log('conditionAircoMode fired');
				const device = args.device;
				const settings = device.getSettings();
				let conditionMet = settings.capability_mode === args.mode;
				// this.log('condition - [settings.capability_mode]', settings.capability_mode);
				// this.log('condition - args.mode', args.mode);
				// this.log('condition - conditionMet capability_mode', conditionMet);
				return conditionMet;
		});

		/* ** FAN SPEED CONDITIONS ** */
		this.conditionFanRateEquals = this.homey.flow.getConditionCard('fan_rate_equals');
		this.conditionFanRateEquals
			.registerRunListener((args, state) => {
				this.log('conditionFanRateEquals fired');
				const device = args.device;
				const devicestate = device.getState();
				var fan_rate_equals = args.frateequals; // control_info[23] = 'A','B','3','4','5','6','7'
				// The enumeration that is used by the airco is translated here in support of MQTTHub by Harrie de Groot
				switch (fan_rate_equals) {
					case 'A':
						fan_rate_equals = 'auto';
						break;

					case 'B':
						fan_rate_equals = 'quiet';
						break;

					case '3':
						fan_rate_equals = 'level1';
						break;

					case '4':
						fan_rate_equals = 'level2';
						break;

					case '5':
						fan_rate_equals = 'level3';
						break;

					case '6':
						fan_rate_equals = 'level4';
						break;

					case '7':
						fan_rate_equals = 'level5';
						break;

					default:
						this.log('unrecognized fan rate !!');
						break;
				}
				let conditionMet = devicestate['fan_rate'] === fan_rate_equals;
				//this.log('condition - [fan_rate]', devicestate['fan_rate']);
				//this.log('condition - args.frateequals', fan_rate_equals);
				//this.log('condition - conditionMet fan rate equals', conditionMet);
				return conditionMet;
		});

		/* ** FAN DIRECTIONS CONDITIONS ** */
		this.conditionFanDirectionEquals = this.homey.flow.getConditionCard('fan_direction_equals');
		this.conditionFanDirectionEquals
			.registerRunListener((args, state) => {
				this.log('conditionFanDirectionEquals fired');
				const device = args.device;
				const devicestate = device.getState();
				var fan_direction_equals = args.fdirequals; // control_info[24] = '0,'1','2','3'
				// The enumeration that is used by the airco is translated here in support of MQTTHub by Harrie de Groot
				switch (fan_direction_equals) {
					case '0':
						fan_direction_equals= 'stop';
						break;

					case '1':
						fan_direction_equals = 'vertical';
						break;

					case '2':
						fan_direction_equals = 'horizontal';
						break;

					case '3':
						fan_direction_equals = '3d';
						break;

					default:
						this.log('unrecognized fan direction !!');
						break;
				}
				let conditionMet = devicestate['fan_direction'] === fan_direction_equals;
				//this.log('condition - [fan_direction]', devicestate['fan_direction']);
				//this.log('condition - args.fdirequals', fan_direction_equals);
				//this.log('condition - conditionMet fan dir equals', conditionMet);
				return conditionMet;
		});

		/* ** ECONO MODE CHANGE CONDITIONS ** */
		this.conditionSmodeEcono = this.homey.flow.getConditionCard('mode_econo_equals');
		this.conditionSmodeEcono
			.registerRunListener((args, state) => {
				this.log('conditionSmodeEcono fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['special_mode_eco'] === args.smode_econo;
				// this.log('condition - [special_mode_eco]', devicestate['special_mode_eco']);
				// this.log('condition - args.smode_econo', args.smode_econo);
				// this.log('condition - conditionMet econo mode', conditionMet);
				return conditionMet;
		});

		/* ** POWERFUL MODE CHANGE CONDITIONS ** */
		this.conditionSmodePwrFul = this.homey.flow.getConditionCard('mode_pwrful_equals');
		this.conditionSmodePwrFul
			.registerRunListener((args, state) => {
				this.log('conditionSmodePwrFul fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['special_mode_pwr'] === args.smode_pwrful;
				return conditionMet;
		});

		/* ** STREAMER MODE CHANGE CONDITIONS ** */
		this.conditionSmodeStrmr = this.homey.flow.getConditionCard('mode_strmr_equals');
		this.conditionSmodeStrmr
			.registerRunListener((args, state) => {
				this.log('conditionSmodeStrmr fired');
				const device = args.device;
				const devicestate = device.getState();
				let conditionMet = devicestate['special_mode_str'] === args.smode_strmr;
				return conditionMet;
		});

		//* ** ACTION FLOWCARDS *******************************************************************************************
		/** * TARGET TEMPERATURE ACTION ** */
		this.actionTargetHum = this.homey.flow.getActionCard('change_target_hum');
		this.actionTargetHum
			.registerRunListener((args, state) => {
				this.log('actionTargetHum fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const ahum = args.ahum;
				if (device.hasCapability('target_humidity') ) {
					device.setCapabilityValue('target_humidity', ahum)
					.catch(device.error);
				}
				this.log('target hum', ahum);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinHumControl(ahum, ip_address, options);
				return Promise.resolve(ahum);
		});

		/** * TARGET TEMPERATURE ACTION ** */
		this.actionTargetTemp = this.homey.flow.getActionCard('change_target_temp');
		this.actionTargetTemp
			.registerRunListener((args, state) => {
				this.log('actionTargetTemp fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const atemp = args.atemp;
				if (device.hasCapability('target_temperature') ) {
					device.setCapabilityValue('target_temperature', atemp)
					.catch(device.error);
				}
				this.log('target temp', atemp);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinTempControl(atemp, ip_address, options);
				return Promise.resolve(atemp);
		});

		/** * TARGET TEMPERATURE BY ACTION ** */
		this.actionTargetTempBy = this.homey.flow.getActionCard('change_target_temp_by');
		this.actionTargetTempBy
			.registerRunListener((args, state) => {
				this.log('actionTargetTempBy fired');
				const device = args.device;
				//this.log('args.device', device);
				const devicestate = device.getState();
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const target_temperature = devicestate['target_temperature'];
				const bytemp = args.bytemp;
				var atemp = (target_temperature + bytemp); // change current target temp by x degC, x is between -5 and +5 degC
				// Check the thermostat mode, unfortunately the use of special airco modes make this a bit complicated... 
				const spmode = settings.spmode;
				var thermostat_mode = devicestate['thermostat_mode'];
				this.log('thermostat_mode: ', thermostat_mode);

				switch (thermostat_mode) {
					case 'cool':
						this.log('Cooling range limits applied');
						if (atemp < 18) {
							atemp = 18
						};
						if (atemp > 32) {
							atemp = 32
						};
						break;
					case 'heat':
						this.log('Heating range limits applied');
						if (atemp < 10) {
							atemp = 10
						};
						if (atemp > 30) {
							atemp = 30
						};
						break;
					default:
						break;
				}

				if (device.hasCapability('target_temperature') ) {
					device.setCapabilityValue('target_temperature', atemp)
					.catch(device.error);
				}
				this.log('target temp', atemp);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				//this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				//this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinTempControl(atemp, ip_address, options);
				return Promise.resolve(atemp);
		});

		// --- MODE CHANGE ACTIONS
		this.actionAircoMode = this.homey.flow.getActionCard('change_mode');
		this.actionAircoMode
			.registerRunListener((args, state) => {
				this.log('actionAircoMode fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const demo_mode = settings.demomode;
				// this.log('demo_mode', demo_mode);

				const thermostat_mode = args.mode;
				const spmode = settings.spmode;
				if (device.hasCapability('thermostat_mode_std') ) {
					device.setCapabilityValue('thermostat_mode_std', thermostat_mode)
					.catch(device.error);
				}
				this.log('thermostat_mode: ', thermostat_mode);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinModeControl(thermostat_mode, ip_address, options, demo_mode);
				return Promise.resolve(thermostat_mode);
		});

		// --- ECONO ACTIONS
		this.actionEcono = this.homey.flow.getActionCard('change_smode_econo');
		this.actionEcono
			.registerRunListener((args, state) => {
				this.log('actionEcono fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const economode = args.smecono;
				if (device.hasCapability('special_mode_eco') ) {
					device.setCapabilityValue('special_mode_eco', economode)
					.catch(device.error);
				}
				this.log('special_mode_eco: ', economode);

				if (economode === "on") {
					var advstate = 1;
					this.log('Econo mode: On');
				} else {
					var advstate = 0;
					this.log('Econo mode: Off');
				};

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinSpecialModeControl("econo", ip_address, options, advstate);
				return Promise.resolve(economode);
		});

		// --- POWERFUL ACTIONS
		this.actionPwrFul = this.homey.flow.getActionCard('change_smode_pwrful');
		this.actionPwrFul
			.registerRunListener((args, state) => {
				this.log('actionPwrFul fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const pwrfulmode = args.smpwrful;
				if (device.hasCapability('special_mode_pwr') ) {
					device.setCapabilityValue('special_mode_pwr', pwrfulmode)
					.catch(device.error);
				}
				this.log('special_mode_pwr: ', pwrfulmode);

				if (pwrfulmode === "on") {
					var advstate = 1;
					this.log('Powerful mode: On');
				} else {
					var advstate = 0;
					this.log('Powerful mode: Off');
				};

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinSpecialModeControl("powerful", ip_address, options, advstate);
				return Promise.resolve(pwrfulmode);
		});

		// --- STREAMER ACTIONS
		this.actionStrmr = this.homey.flow.getActionCard('change_smode_strmr');
		this.actionStrmr
			.registerRunListener((args, state) => {
				this.log('actionStrmr fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const strmrmode = args.smstrmr;
				if (device.hasCapability('special_mode_str') ) {
					device.setCapabilityValue('special_mode_str', strmrmode)
					.catch(device.error);
				}
				this.log('special_mode_str: ', strmrmode);

				if (strmrmode === "on") {
					var advstate = 1;
					this.log('Streamer mode: On');
				} else {
					var advstate = 0;
					this.log('Streamer mode: Off');
				};

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinSpecialModeControl("streamer", ip_address, options, advstate);
				return Promise.resolve(strmrmode);
		});

		// --- FAN RATE ACTIONS
		this.actionFanRate = this.homey.flow.getActionCard('change_fan_rate');
		this.actionFanRate
			.registerRunListener((args, state) => {
				this.log('actionFanRate fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				var fan_rate = args.frate; // control_info[23] = 'A','B','3','4','5','6','7'
				// The enumeration that is used by the airco is translated here in support of MQTTHub by Harrie de Groot
				switch (fan_rate) {
					case 'A':
						fan_rate = 'auto';
						break;

					case 'B':
						fan_rate = 'quiet';
						break;

					case '3':
						fan_rate = 'level1';
						break;

					case '4':
						fan_rate = 'level2';
						break;

					case '5':
						fan_rate = 'level3';
						break;

					case '6':
						fan_rate = 'level4';
						break;

					case '7':
						fan_rate = 'level5';
						break;

					default:
						this.log('unrecognized fan rate !!, auto selected !!');
						fan_rate = 'auto';
						break;
				}
				if (device.hasCapability('fan_rate') ) {
					device.setCapabilityValue('fan_rate', fan_rate)
					.catch(device.error);
				}
				this.log('fan_rate', fan_rate);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinFanRateControl(fan_rate, ip_address, options);
				return Promise.resolve(fan_rate);
		});

		// --- FAN DIRECTION ACTIONS
		this.actionFanDirection = this.homey.flow.getActionCard('change_fan_direction');
		this.actionFanDirection
			.registerRunListener((args, state) => {
				this.log('actionFanDirection fired');
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				var fan_direction = args.fdir; // control_info[24] = '0,'1','2','3'
				// The enumeration that is used by the airco is translated here in support of MQTTHub by Harrie de Groot
				switch (fan_direction) {
					case '0':
						fan_direction = 'stop';
						break;

					case '1':
						fan_direction = 'vertical';
						break;

					case '2':
						fan_direction = 'horizontal';
						break;

					case '3':
						fan_direction = '3d';
						break;

					default:
						this.log('unrecognized fan direction !!, fan turned off !!');
						var fan_direction = 'stop';
						break;
				}
				if (device.hasCapability('fan_direction') ) {
					device.setCapabilityValue('fan_direction', fan_direction)
					.catch(device.error);
				}
				this.log('fan_direction', fan_direction);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinFanDirControl(fan_direction, ip_address, options);
				return Promise.resolve(fan_direction);
		});
	}
}

module.exports = AirAirHPDriver;
