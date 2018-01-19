import BaseGrid from 'common/map/baseGrid';
import MapTileIDs from '1846/config/mapTileIds';
import _ from 'lodash';
import Cell from 'common/map/cell';
import OffBoardCell from '1846/map/offBoardCell';
import Tile from 'common/map/tile';
import TileManifest from '1846/config/tileManifest';
import Events from 'common/util/events';
import CurrentGame from 'common/game/currentGame';
import TerrainTypes from '1846/config/terrainTypes';
import Route from 'common/model/route';

const RowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

const OffBoardIds = {
    CHICAGO_CONNECTIONS: 'chicago_connections',
    ST_LOUIS: 'st_louis',
    HOLLAND: 'holland',
    SARNIA: 'sarnia',
    WINDSOR: 'windsor',
    LOUISVILLE: 'louisville',
    CHARLESTON: 'charleston',
    BUFFALO: 'buffalo',
    BINGHAMTON: 'binghamton',
    PITTSBURGH: 'pittsburgh',
    CUMBERLAND: 'cumberland'
};

const SpecialTiles = {
    A15: MapTileIDs.A15,
    B16: MapTileIDs.PORT_HURON,
    C7: MapTileIDs.C7,
    C9: MapTileIDs.CITY,
    C15: MapTileIDs.DETROIT,
    D6: MapTileIDs.CHICAGO,
    D14: MapTileIDs.CITY,
    D20: MapTileIDs.ERIE,
    E11: MapTileIDs.CITY,
    E17: MapTileIDs.CLEVELAND,
    E21: MapTileIDs.SALAMANCA,
    F20: MapTileIDs.HOMEWOOD,
    G3: MapTileIDs.CITY,
    G7: MapTileIDs.CITY,
    G9: MapTileIDs.CITY,
    G13: MapTileIDs.CITY,
    G15: MapTileIDs.CITY,
    G19: MapTileIDs.WHEELING,
    H12: MapTileIDs.CINCINNATI,
    I5: MapTileIDs.CENTRALIA,
    I15: MapTileIDs.HUNTINGTON,
    K3: MapTileIDs.CAIRO,
    [OffBoardIds.CHICAGO_CONNECTIONS]: MapTileIDs.CHICAGO_CONNECTIONS,
    [OffBoardIds.ST_LOUIS]: MapTileIDs.ST_LOUIS,
    [OffBoardIds.HOLLAND]: MapTileIDs.HOLLAND,
    [OffBoardIds.SARNIA]: MapTileIDs.SARNIA,
    [OffBoardIds.WINDSOR]: MapTileIDs.WINDSOR,
    [OffBoardIds.LOUISVILLE]: MapTileIDs.LOUISVILLE,
    [OffBoardIds.CHARLESTON]: MapTileIDs.CHARLESTON,
    [OffBoardIds.BUFFALO]: MapTileIDs.BUFFALO,
    [OffBoardIds.BINGHAMTON]: MapTileIDs.BINGHAMTON,
    [OffBoardIds.PITTSBURGH]: MapTileIDs.PITTSBURGH,
    [OffBoardIds.CUMBERLAND]: MapTileIDs.CUMBERLAND
};


const ConnectionCosts = {
    B16: {1: {cost: 40, type: TerrainTypes.TUNNEL}},
    SARNIA: {'B16|4': {cost: 40, type: TerrainTypes.TUNNEL}},
    C15: {1: {cost: 60, type: TerrainTypes.TUNNEL}},
    WINDSOR: {'C15|4': {cost: 60, type: TerrainTypes.TUNNEL}},
    E19: {2: {cost: 40, type: TerrainTypes.TUNNEL}},
    F20: {5: {cost: 40, type: TerrainTypes.TUNNEL}},
    F18: {2: {cost: 40, type: TerrainTypes.BRIDGE}},
    G17: {1: {cost: 20, type: TerrainTypes.BRIDGE}},
    G19: {
        5: {cost: 40, type: TerrainTypes.BRIDGE},
        4: {cost: 20, type: TerrainTypes.BRIDGE},
        1: {cost: 20, type: TerrainTypes.TUNNEL}
    },
    PITTSBURGH: {'G19|4': {cost: 20, type: TerrainTypes.TUNNEL}},
    H12: {3: {cost: 40, type: TerrainTypes.BRIDGE}},
    I11: {0: {cost: 40, type: TerrainTypes.BRIDGE}},
    J4: {1: {cost: 40, type: TerrainTypes.BRIDGE}},
    J6: {4: {cost: 40, type: TerrainTypes.BRIDGE}}
};

const OffBoardDefinitions = {
    [OffBoardIds.CHICAGO_CONNECTIONS]: {
        id: OffBoardIds.CHICAGO_CONNECTIONS,
        top: 171,
        left: 9,
        row: 0,
        col: 0,
        width: 304,
        height: 110,
        outline: '-152, -55 152, -55 152, 18 88,55 -152, 55',
        connectionsToNeighborIndex: {'D6|2': 0}
    },
    [OffBoardIds.ST_LOUIS]: {
        id: OffBoardIds.ST_LOUIS,
        top: 778,
        left: 0,
        row: 0,
        col: 0,
        width: 126,
        height: 254,
        outline: '-63,-127 3,-91, 1, -19 63,17 63,89 1,127 -63, 127',
        connectionsToNeighborIndex: {'H2|0': 0, 'I3|1': 1}
    },
    [OffBoardIds.HOLLAND]: {
        id: OffBoardIds.HOLLAND,
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        connectionsToNeighborIndex: {'B10|1': 0}
    },
    [OffBoardIds.SARNIA]: {
        id: OffBoardIds.SARNIA,
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        connectionsToNeighborIndex: {'B16|4': 0},
        connectionCosts: ConnectionCosts[OffBoardIds.SARNIA]
    },
    [OffBoardIds.WINDSOR]: {
        id: OffBoardIds.WINDSOR,
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        connectionsToNeighborIndex: {'C15|4': 0},
        connectionCosts: ConnectionCosts[OffBoardIds.WINDSOR]
    },
    [OffBoardIds.LOUISVILLE]: {
        id: OffBoardIds.LOUISVILLE,
        top: 886,
        left: 498,
        row: 0,
        col: 0,
        width: 126,
        height: 144,
        connectionsToNeighborIndex: {'I9|5': 0, 'I11|0': 1}
    },
    [OffBoardIds.CHARLESTON]: {
        id: OffBoardIds.CHARLESTON,
        top: 738,
        left: 932,
        row: 0,
        col: 0,
        width: 126,
        height: 130,
        outline: '-63,10 0,-23 0, -65 63,-65, 63,65 -63, 65',
        connections: ['I15|4', 0]
    },
    [OffBoardIds.BUFFALO]: {
        id: OffBoardIds.BUFFALO,
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        connectionsToNeighborIndex: {'D20|3': 0, 'D20|4': 1}
    },
    [OffBoardIds.BINGHAMTON]: {
        id: OffBoardIds.BINGHAMTON,
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        connectionsToNeighborIndex: {'E21|4': 0}
    },
    [OffBoardIds.PITTSBURGH]: {
        id: OffBoardIds.PITTSBURGH,
        top: 495,
        left: 1180,
        row: 0,
        col: 0,
        width: 188,
        height: 178,
        outline: '-94,17 -32,-19 -32,-89 94, -89 94,89 -94, 89',
        connectionsToNeighborIndex: {'F20|4': 0, 'F20|5': 1, 'G19|4': 2},
        connectionCosts: ConnectionCosts[OffBoardIds.PITTSBURGH]
    },
    [OffBoardIds.CUMBERLAND]: {
        id: OffBoardIds.CUMBERLAND,
        top: 672,
        left: 1118,
        row: 0,
        col: 0,
        width: 250,
        height: 122,
        outline: '-125,-24 -62,-61 125, -61 125,61 -125, 61',
        connectionsToNeighborIndex: {'G19|5': 0}
    }
};

class Grid extends BaseGrid {
    constructor(state) {

        super({cellSize: 124, cells: []});
        this.cells(this.createCells(state));

        this.routing = false;
        this.route = null;
        this.connectNeighbors();

        Events.on('stateUpdated', () => {
            _.each(CurrentGame().state().tilesByCellId, (tile, cellId) => {
                this.cellsById()[cellId].tile(tile);
            });

            Events.emit('gridRestored');
        });
    }

    createCells(state) {
        const cells = _(_.range(0, 11 * 12)).map((value) => {

            const row = Math.floor(value / 12);
            const col = value % 12;

            if (row === 0 && (col !== 6)) {
                return
            }

            if (row === 1 && ( col < 4 || col > 7)) {
                return;
            }

            if (row === 2 && ( col < 2 || col > 6)) {
                return;
            }

            if (row === 3 && ( col < 2 || col === 7 || col > 9)) {
                return;
            }

            if ((row === 4 || row === 5) && (col < 1 || col > 9)) {
                return;
            }

            if (row === 6 && col > 8) {
                return;
            }

            if (row === 7 && col > 7) {
                return;
            }

            if (row === 8 && (col === 5 || col > 6)) {
                return;
            }

            if (row === 9 && (col < 1 || col > 3)) {
                return;
            }

            if (row === 10 && col !== 0) {
                return;
            }

            const id = Grid.getIDForRowAndColumn(row, col);
            return new Cell({
                                id: id,
                                row,
                                col,
                                top: 30 + ((row - 1) * 107),
                                left: 2 + (((row - 1) % 2) ? 62 : 0) + col * 124,
                                connectionCosts: ConnectionCosts[id]
                            });
        }).compact().value();

        const offBoardCells = _.map(OffBoardIds, offBoardId => {
            return new OffBoardCell(OffBoardDefinitions[offBoardId]);
        });

        const allCells = _.concat(cells, offBoardCells);

        _.each(allCells, (cell) => {
            const tile = TileManifest.createTile(SpecialTiles[cell.id] || MapTileIDs.BLANK);
            state.tilesByCellId[cell.id] = tile;
            cell.tile(tile);
        });

        return allCells;
    }

    connectNeighbors() {
        _.each(this.cells(), (cell) => {
            cell.neighbors[0] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row - 1,
                                                                           cell.col + (cell.row % 2 ? 0 : 1))];
            cell.neighbors[1] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row, cell.col + 1)];
            cell.neighbors[2] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row + 1,
                                                                           cell.col + (cell.row % 2 ? 0 : 1))];
            cell.neighbors[3] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row + 1,
                                                                           cell.col - (cell.row % 2 ? 1 : 0))];
            cell.neighbors[4] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row, cell.col - 1)];
            cell.neighbors[5] = this.cellsById()[Grid.getIDForRowAndColumn(cell.row - 1,
                                                                           cell.col - (cell.row % 2 ? 1 : 0))];
            // console.log('Cell ' + cell.id + ' Neighbors: [' + (cell.neighbors[0] ? cell.neighbors[0].id : 'None') + ',' +
            //        (cell.neighbors[1] ? cell.neighbors[1].id : 'None') + ',' +
            //        (cell.neighbors[2] ? cell.neighbors[2].id : 'None') + ',' +
            //        (cell.neighbors[3] ? cell.neighbors[3].id : 'None') + ',' +
            //        (cell.neighbors[4] ? cell.neighbors[4].id : 'None') + ',' +
            //        (cell.neighbors[5] ? cell.neighbors[5].id : 'None') + ']');
        });

        const b10 = this.cellsById()['B10'];
        const holland = this.cellsById()[OffBoardIds.HOLLAND];
        b10.neighbors[4] = holland;
        holland.neighbors = [b10];

        const chicago = this.cellsById()['D6'];
        const chicagoConnections = this.cellsById()[OffBoardIds.CHICAGO_CONNECTIONS];
        chicago.neighbors[5] = chicagoConnections;
        chicagoConnections.neighbors = [chicago];

        const stLouis = this.cellsById()[OffBoardIds.ST_LOUIS];
        const h2 = this.cellsById()['H2'];
        h2.neighbors[3] = stLouis;

        const i3 = this.cellsById()['I3'];
        i3.neighbors[4] = stLouis;
        stLouis.neighbors = [h2, i3];

        const b16 = this.cellsById()['B16'];
        b16.neighbors[1] = this.cellsById()[OffBoardIds.SARNIA];

        const c15 = this.cellsById()['C15'];
        c15.neighbors[1] = this.cellsById()[OffBoardIds.WINDSOR];

        const d20 = this.cellsById()['D20'];
        d20.neighbors[0] = this.cellsById()[OffBoardIds.BUFFALO];
        d20.neighbors[1] = this.cellsById()[OffBoardIds.BUFFALO];

        const e21 = this.cellsById()['E21'];
        e21.neighbors[1] = this.cellsById()[OffBoardIds.BINGHAMTON];

        const pittsburgh = this.cellsById()[OffBoardIds.PITTSBURGH];
        const f20 = this.cellsById()['F20'];
        f20.neighbors[1] = pittsburgh;
        f20.neighbors[2] = pittsburgh;

        const g19 = this.cellsById()['G19'];
        g19.neighbors[1] = pittsburgh;
        pittsburgh.neighbors = [f20, f20, g19];

        const cumberland = this.cellsById()[OffBoardIds.CUMBERLAND];
        g19.neighbors[2] = cumberland;
        cumberland.neighbors = [g19];

        const charleston = this.cellsById()[OffBoardIds.CHARLESTON];
        const i15 = this.cellsById()['I15'];
        i15.neighbors[1] = this.cellsById()[OffBoardIds.CHARLESTON];
        charleston.neighbors = [i15];

        const louisville = this.cellsById()[OffBoardIds.LOUISVILLE];
        const i9 = this.cellsById()['I9'];
        i9.neighbors[2] = louisville;

        const i11 = this.cellsById()['I11'];
        i11.neighbors[3] = louisville;
        louisville.neighbors = [i9, i11];
    }

    static costForCell(id) {

    }

    static getIDForRowAndColumn(row, column) {
        return RowLetters[row] + (column * 2 + ((row % 2) ? 2 : 3));
    }

    onMouseOver(cell) {
        if (!this.routing) {
            return;
        }

        // If reentering earlier in the route, prune to here
        if (this.route.containsCell(cell.id)) {
            if (this.route.lastCell().id !== cell.id) {
                if (this.route.firstCell().id === cell.id) {
                    this.startRoute(cell);
                    return;
                }
                else {
                    const index = this.route.cellIndex(cell.id);
                    const removedCells = this.route.pruneAt(index - 1);
                    _.each(removedCells,
                           cell => this.cellsById()[cell.id].tile().clearRoutedConnections(this.route.id));
                    cell.tile().clearRoutedConnections(this.route.id);
                }
            }
        }

        if (this.route.isFull()) {
            return;
        }

        const lastCellInRoute = this.cellsById()[this.route.lastCell().id];

        // Find connections in the current cell which are available for routing
        const connectionsToLastCellInRoute = cell.getConnectionsToCell(lastCellInRoute);
        const usedCurrentConnectionPoints = {};
        const routeableConnectionsToPrior = _.reject(connectionsToLastCellInRoute, connection => {
            const connectionPoint = connection[0] >= 0 && connection[0] < 7 ? connection[0] : connection[1];
            if (usedCurrentConnectionPoints[connectionPoint]) {
                return true;
            }

            if (cell.tile().hasOtherRoutedConnection(connection, this.route.id)) {
                usedCurrentConnectionPoints[connectionPoint] = true;
                return true;
            }
        });

        const edgeToPrior = cell.getConnectionEdgeToCell(lastCellInRoute);
        const startPoint = cell.getConnectionPointAtIndex(cell, edgeToPrior);
        // const routeableConnectionsToPrior = _.reject(connectionsToLastCellInRoute, connection => {
        //     const endPoint = connection[0] === startPoint ? connection[1] : connection[0];
        //     const connectionsToEnd = cell.getConnectionsToPoint(cell, endPoint);
        //     return _.find(connectionsToEnd,
        //                   connectionToEnd => cell.tile().hasOtherRoutedConnection(connectionToEnd, this.route.id));
        // });
        //
        // Find connections in the prior cell which are available for routing
        const lastCellInRouteConnectionsToCurrent = lastCellInRoute.getConnectionsToCell(cell);
        const usedPriorConnectionPoints = {};
        const routeableConnectionsToCurrent = _.reject(lastCellInRouteConnectionsToCurrent, connection => {
            const connectionPoint = connection[0] >= 0 && connection[0] < 7 ? connection[0] : connection[1];
            if (usedPriorConnectionPoints[connectionPoint]) {
                return true;
            }

            if (lastCellInRoute.tile().hasOtherRoutedConnection(connection, this.route.id)) {
                usedPriorConnectionPoints[connectionPoint] = true;
                return true;
            }
        });


        if (routeableConnectionsToPrior.length === 0) {
            return;
        }
        if (routeableConnectionsToCurrent.length === 0) {
            return;
        }

        // if (_.find(lastCellInRouteConnectionsToCurrent,
        //            connection => lastCellInRoute.tile().hasOtherRoutedConnection(connection, this.route.id))) {
        //     return;
        // }
        //
        // if (!_.find(lastCellInRouteConnectionsToCurrent,
        //             connection => lastCellInRoute.tile().hasRoutedConnection(connection, this.route.id))) {
        //     return;
        // }

        // set the correct connections in the previous tile for this route
        let lastCellConnections = [];
        if (this.route.numCells() > 1) {
            // Not a terminus for the route
            const nextToLastCellInRoute = this.cellsById()[this.route.nextToLastCell().id];
            lastCellConnections = lastCellInRoute.getConnectionsFromNeighborToNeighbor(cell, nextToLastCellInRoute);
        }
        else if (lastCellInRoute.id === 'D6') {
            // Chicago is special with the many cities to one
            // Need to find the city with a station
            const routedConnections = _.filter(lastCellInRouteConnectionsToCurrent,
                                               connection => lastCellInRoute.tile().hasRoutedConnection(connection,
                                                                                                        this.route.id));

            const stationedConnection = _.find(routedConnections, connection => {
                return lastCellInRoute.tile().hasTokenForCompany(CurrentGame().state().currentCompanyId(),
                                                                 _.max(connection));
            });

            lastCellConnections = stationedConnection ? [stationedConnection] : routedConnections;
        }
        else {
            lastCellConnections = [_.first(routeableConnectionsToCurrent)];
        }

        lastCellInRoute.tile().clearRoutedConnections(this.route.id);
        _.each(lastCellConnections, connection => {
            lastCellInRoute.tile().addRoutedConnection(connection, 'gray', this.route.id);
        });
        this.route.updateConnections(lastCellInRoute.id, lastCellConnections);

        // Now add the connections in our current tile

        _.each(routeableConnectionsToPrior,
               connection => cell.tile().addRoutedConnection(connection, 'gray', this.route.id));

        // Add the cell to the route
        this.route.addCell(cell.id, routeableConnectionsToPrior);

        // Cap off the route if full
        if (this.route.isFull()) {
            const connection = _.first(routeableConnectionsToPrior);
            cell.tile().clearRoutedConnections(this.route.id);
            cell.tile().addRoutedConnection(connection, 'gray', this.route.id);
            this.route.updateConnections(cell.id, [connection]);
        }

        const valid = this.route.isValid();
        _.each(this.route.cells(),
               cell => this.cellsById()[cell.id].tile().updateRoutedConnectionsColor(this.route.id,
                                                                                     valid ? this.route.color : 'gray'));


    }

    onMouseOut(cell) {
        //console.log('mouse leaving cell ' + cell.id);
    }

    startRoute(cell) {
        _.each(this.route.cells(), cell => this.cellsById()[cell.id].tile().clearRoutedConnections(this.route.id));
        this.route.clear();
        _.each(cell.tile().getUnroutedConnections(),
               connection => cell.tile().addRoutedConnection(connection, 'gray', this.route.id));
        this.route.addCell(cell.id, cell.tile().getUnroutedConnections);
    }

    onMouseDown(cell) {
        if (cell.tile().getRevenue() > 0 && this.route) {
            this.startRoute(cell);
            this.routing = true;
        }
    }

    onMouseUp(cell) {
        if (!this.routing) {
            return;
        }

        const removedCells = this.route.pruneToLastRevenueLocation();
        _.each(removedCells, cell => this.cellsById()[cell.id].tile().clearRoutedConnections(this.route.id));

        if (!this.route.isValid()) {
            _.each(this.route.cells(), cell => this.cellsById()[cell.id].tile().clearRoutedConnections(this.route.id));
            this.route.clear();
        }
        else {
            const lastCell = this.cellsById()[this.route.lastCell().id];
            const nextToLastCell = this.cellsById()[this.route.nextToLastCell().id];
            if (_.keys(lastCell.tile().cities).length > 0) {
                const priorConnections = lastCell.getConnectionsToCell(nextToLastCell);
                const usedConnectionPoints = {};
                const routeablePriorConnections = _.reject(priorConnections, connection => {
                    const connectionPoint = connection[0] >= 0 && connection[0] < 7 ? connection[0] : connection[1];
                    if (usedConnectionPoints[connectionPoint]) {
                        return true;
                    }

                    if (lastCell.tile().hasOtherRoutedConnection(connection, this.route.id)) {
                        usedConnectionPoints[connectionPoint] = true;
                        return true;
                    }
                });

                const connection = _.first(routeablePriorConnections);
                lastCell.tile().clearRoutedConnections(this.route.id);
                lastCell.tile().addRoutedConnection(connection, this.route.color, this.route.id);
                this.route.updateConnections(lastCell.id, [connection]);
            }
        }

        console.log(JSON.stringify(this.route))
        this.routing = false;
    }
}

export default Grid;