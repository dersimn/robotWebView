package application;


import javax.inject.Inject;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.json.JSONArray;

import java.util.concurrent.TimeUnit;
import com.kuka.roboticsAPI.applicationModel.tasks.CycleBehavior;
import com.kuka.roboticsAPI.applicationModel.tasks.RoboticsAPICyclicBackgroundTask;
import com.kuka.roboticsAPI.controllerModel.Controller;
import com.kuka.roboticsAPI.deviceModel.JointPosition;
import com.kuka.roboticsAPI.deviceModel.LBR;

/**
 * Implementation of a cyclic background task.
 * <p>
 * It provides the {@link RoboticsAPICyclicBackgroundTask#runCyclic} method 
 * which will be called cyclically with the specified period.<br>
 * Cycle period and initial delay can be set by calling 
 * {@link RoboticsAPICyclicBackgroundTask#initializeCyclic} method in the 
 * {@link RoboticsAPIBackgroundTask#initialize()} method of the inheriting 
 * class.<br>
 * The cyclic background task can be terminated via 
 * {@link RoboticsAPICyclicBackgroundTask#getCyclicFuture()#cancel()} method or 
 * stopping of the task.
 * @see UseRoboticsAPIContext
 * 
 */
public class MqttPublish extends RoboticsAPICyclicBackgroundTask {
	@Inject
	private Controller cabinet;
	@Inject
	private LBR robot;
	private MqttClient mqtt;

	@Override
	public void initialize() {
		// initialize your task here
		initializeCyclic(0, 500, TimeUnit.MILLISECONDS, CycleBehavior.BestEffort);
		
		try {
			mqtt = new MqttClient("tcp://10.30.21.40:1883", "KUKA01");
			MqttConnectOptions connOpts = new MqttConnectOptions();
			connOpts.setWill("kuka/maintenance/1/online", new String("false").getBytes(), 0, true);
			mqtt.connect();
			MqttMessage message = new MqttMessage(new String("true").getBytes());
			message.setRetained(true);
			mqtt.publish("kuka/maintenance/1/online", message);
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}
	
	public void dispose() {
		try {
			MqttMessage message = new MqttMessage(new String("false").getBytes());
			message.setRetained(true);
			mqtt.publish("kuka/maintenance/1/online", message);
			
			mqtt.disconnect();
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void runCyclic() {
		JointPosition pos = robot.getCurrentJointPosition();
		JSONArray posJson = new JSONArray();
		
		for (int i = 0; i < pos.getAxisCount(); i++) {
			posJson.put(pos.get(i));
		}
		
		try {
			mqtt.publish("kuka/status/1/currentJointPosition", new MqttMessage(posJson.toString().getBytes()));
		} catch (MqttPersistenceException e) {
			e.printStackTrace();
		} catch (MqttException e) {
			e.printStackTrace();
		}
	}
}