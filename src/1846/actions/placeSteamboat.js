import Action from 'common/game/action';
import OffBoardIDs from '1846/config/offBoardIds';

const LocationNames = {
    [OffBoardIDs.CHICAGO_CONNECTIONS]: 'Chicago Connections',
    [OffBoardIDs.HOLLAND]: 'Holland',
    [OffBoardIDs.ST_LOUIS]: 'St Louis',
    D14: 'Toledo',
    G19: 'Wheeling'
};

class PlaceSteamboat extends Action {

    constructor(args) {
        super(args);
        this.playerId = args.playerId;
        this.companyId = args.companyId;
        this.cellId = args.cellId;
    }

    doExecute(state) {
        const tile = state.tilesByCellId[this.cellId];
        tile.hasSteamboat(this.companyId);
        this.recalculateRouteRevenue(state);
    }

    doUndo(state) {
        const tile = state.tilesByCellId[this.cellId];
        tile.hasSteamboat(null);
        this.recalculateRouteRevenue(state);
    }


    recalculateRouteRevenue(state) {
        _.each(state.allCompaniesById, company => {
            if (company.closed()) {
                return;
            }
            _.each(company.getNonRustedTrains(), train => {
                train.route.calculateRevenue();
            });
        });
    }


    summary(state) {
        const company = state.getCompany(this.companyId);
        return company.nickname + ' placed steamboat token in ' + LocationNames[this.cellId];
    }
}

PlaceSteamboat.registerClass();

export default PlaceSteamboat