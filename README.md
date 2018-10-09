[![](https://github.com/dersimn/robotWebView/raw/master/docs/demo.gif)](https://github.com/dersimn/robotWebView/raw/master/docs/demo.mov)

Simple Robot WebView based on [three.js](https://threejs.org), [urdf-loaders](https://github.com/gkjohnson/urdf-loaders) and Paho MQTT for the _KUKA LBR iiwa_.

## Usage

- Create backround application on the Sunrise Controler for publishing current joint positions (see [MqttPublish.java](https://github.com/dersimn/robotWebView/blob/master/docs/MqttPublish.java) for reference).
- Set up an MQTT broker with websocket support, for e.g.: `docker run -d --rm -p 1883:1883 -p 9001:9001 toke/mosquitto`.
- Edit fixed IP addresses in source code.
- Open index.htm through a webserver, for e.g.: `docker run -d --rm -p 80:80 -v $(pwd):/usr/share/nginx/html:ro nginx`.

## Credits

URDF files from [Salvatore Virga](https://github.com/IFL-CAMP/iiwa_stack/tree/master/iiwa_description), pre-generated xacro files from [Philipp Wüstenberg](https://gitlab.tubit.tu-berlin.de/philippwuestenberg/ILA_ros_src/tree/master/src/iiwa_stack-indigo/iiwa_description).