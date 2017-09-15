import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';


var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        ReactDOM.render(<AppPage />, document.getElementById('app'));
        console.log('Received Event: ' + id);
    }
};

app.initialize();


/* (sample) First page to be displayed */
class AppPage extends React.Component {

    constructor() {
        super();
        // Do nothing for now
    }

    renderToolbar() {
        return (
            <Ons.Toolbar>
              <div className='center'>Lighthouse</div>
              <div className='right'>
              <Ons.ToolbarButton>
                <Ons.Icon icon='ion-navicon, material:md-menu'></Ons.Icon>
              </Ons.ToolbarButton>
              </div>
            </Ons.Toolbar>
          );
    }

    handleClick() {
        ons.notification.alert('Hello world!');
    }

    render() {
        return (
            <Ons.Page renderToolbar={this.renderToolbar}>
                <p style={{ textAlign: 'center' }}>
                    <Ons.Button onClick={this.handleClick}>
                        Click me
              </Ons.Button>
                </p>
            </Ons.Page>
        )
    }

}