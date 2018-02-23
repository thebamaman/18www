import ko from 'knockout';
import CurrentGame from 'common/game/currentGame';
import GameRecord from 'common/game/gameRecord';
import NewGameForm from 'common/ui/newGameForm';
import Game from '1846/game/game';
import Sequence from '1846/game/sequence';
import 'common/util/knockoutBootstrapBindings';
import _ from 'lodash';
import 'knockout-delegated-events';
import Events from 'common/util/events';
import History from 'common/util/history';
import LZString from 'lz-string';

const ActivePanelIDs = {
    ACTIVE_GAMES: 'active_games',
    COMPLETED_GAMES: 'completed_games',
    NEW_GAME: 'new_game'
};

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class Dashboard {
    constructor() {
        this.game = ko.computed(() => {
            return CurrentGame();
        });

        this.availableGames = ko.observableArray();
        this.completedGames = ko.observableArray();
        this.newGameForm = new NewGameForm();

        this.activePanel = ko.observable(ActivePanelIDs.ACTIVE_GAMES);
        this.ActivePanelIDs = ActivePanelIDs;
        this.rootPath = '/';

        Events.on('newGameCreated', (record) => {
            this.loadAvailableGames();
            this.launchGame(record);
        });

        this.loadAvailableGames();

        Events.on('nav-change', (state) => {
            this.checkNavigation(state);
        });

        Events.emit('app-ready');
    }

    resetGame() {
        if (CurrentGame()) {
            Events.emit('game-reset');
            Events.removeAllListeners('trackLaid');
            Events.removeAllListeners('gridRestored');
            Events.removeAllListeners('undo');
            Events.removeAllListeners('turnEnd');
            Events.removeAllListeners('stateUpdated');
            Events.removeAllListeners('drawRoutes');
            Events.removeAllListeners('clearRoutes');
            Events.removeAllListeners('global:mouseup');
            Events.removeAllListeners('global:mouseout');
            Events.removeAllListeners('tileUpdated');
            CurrentGame(null);
        }
    }

    checkNavigation(state) {
        const fromState = state && state.game;

        this.resetGame();

        const gameId = fromState ? state.game : getParameterByName('game');
        if (gameId) {
            const record = GameRecord.load(gameId);
            if (record) {
                this.launchGame(record, fromState);
                return;
            }
        }

        History.replaceState({}, 'Games', this.rootPath);
    }

    setActivePanel(newPanel) {
        this.activePanel(newPanel);
    }

    loadAvailableGames() {
        this.availableGames(_.orderBy(GameRecord.list(), ['startDate', 'name']));
    }

    showDashboard() {
        this.resetGame();
        History.pushState({}, 'Games', this.rootPath);
    }

    launchGame(record, fromState) {
        const state = record.loadCurrentState();
        const game = new Game({record: record, state: state});
        CurrentGame(game);
        game.sequence.restore();
        Events.emit('stateUpdated');
        if (!fromState) {
            History.pushState({game: record.id}, record.name, this.rootPath + '?game=' + record.id);
        }
    }

    onMouseUp() {
        Events.emit('global:mouseup');
    }

    onMouseOut() {
        Events.emit('global:mouseout');
    }

    downloadState() {
        if(!CurrentGame()) {
            return;
        }
        const record = CurrentGame().record;
        const state = record.loadCurrentState();
        const download = {
            record: record.serialize(),
            state: state.serialize()
        };
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + LZString.compressToEncodedURIComponent(download));
        element.setAttribute('download', '1846-' + record.name + '-state');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    sendBugEmail() {
        const link = "mailto:justin.waugh@gmail.com?subject=1846 Bug Report";
        const element = document.createElement('a');
        element.setAttribute('href', link);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

export default Dashboard;