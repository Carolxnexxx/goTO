# GoTO
 litter tracking app

colors: 
green: e6f9e6
dark green: 6ccf8e
blue: a8d3e6

<Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Log In">
            {props => <LogIn {...props} notificationCallback={schedulePushNotification} />}
          </Tab.Screen>
          <Tab.Screen name="Rewards">
            {props => <Rewards {...props} notificationCallback={schedulePushNotification} />}
          </Tab.Screen>
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name='Calendar' component={CalendarScreen} />