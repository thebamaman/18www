import _ from 'lodash';
import ko from 'knockout';
import Turn from 'common/game/turn';
import Serializable from 'common/model/serializable';

class TurnHistory extends Serializable {
    constructor(definition) {
        definition = definition || {};
        super(definition);
        this.turns = ko.observableArray(definition.turns || []);
        this.currentTurn = ko.observable(definition.currentTurn);
    }

    startTurn(args) {
        args = args || {};
        this.currentTurn(new Turn({
            number: this.nextTurnNumber(),
            context: args.turnContext,
            state: args.state,
        }));
    }

    rollbackTurn() {
        if (this.currentTurn()) {
            this.currentTurn().undo();
        }
    }

    rollbackCurrentAction() {
        this.currentTurn().rollbackActionGroup();
    }

    commitTurn() {
        this.currentTurn().commit();
        this.turns.push(this.currentTurn());
        this.currentTurn(null);
    }

    undoLastTurn() {
        const turn = this.turns.pop();
        turn.undo();
    }

    getTurn(id) {
        return this.currentTurn() && this.currentTurn().id === id ? this.currentTurn() : _.find(this.turns(), {id});
    }

    getCurrentTurn() {
        return this.currentTurn();
    }

    lastTurn() {
        return _.last(this.turns());
    }

    nextTurnNumber() {
        return this.turns().length + 1;
    }

    getTurnsForRange(startIndex, endIndex, playerId) {
        return _.filter(this.turns(), turn=>turn.isWithinRange(startIndex, endIndex) && (!playerId || turn.playerId === playerId));
    }

}

TurnHistory.registerClass();

export default TurnHistory;