import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { AppPage } from './AppPage';

export class MainPage extends React.Component {

    constructor(navigator) {
        super();

        //Initialize class variables
        this.navigator = navigator.navigator;
        this.state = {
            menuOpened: false
        }

    }

    closeMenu() {
        this.setState({ menuOpened: false })
    }

    openMenu() {
        this.setState({ menuOpened: true })
    }

    logout() {
        this.navigator.resetPage({ component: AppPage, key: 'app-page', animation: 'slide' });
    }

    renderToolbar() {
        return (
            <Ons.Toolbar>
                <div className='left'>
                    <Ons.ToolbarButton onClick={this.openMenu.bind(this)}>
                        <Ons.Icon icon='ion-navicon' />
                        xx
                    </Ons.ToolbarButton>
                </div>
                <div className='center'>Main page</div>
            </Ons.Toolbar>
        );
    }

    render() {
        return (
            <Ons.Page>
                <Ons.Splitter>
                    <Ons.SplitterSide side='left' width={200} collapse={true} isSwipeable={true}
                        isOpen={this.state.menuOpened} onClose={this.closeMenu.bind(this)} onOpen={this.openMenu.bind(this)}>
                        <Ons.Page>
                            <p>List items here</p>
                            <Ons.List />

                            <p onClick={this.logout.bind(this)} className="logout">Logout</p>
                        </Ons.Page>
                    </Ons.SplitterSide>
                    <Ons.SplitterContent>
                        <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                            <p>some text here</p>
                        </Ons.Page>
                    </Ons.SplitterContent>
                </Ons.Splitter >
            </Ons.Page>
        )
    }
}