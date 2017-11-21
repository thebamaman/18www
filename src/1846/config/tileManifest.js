import _ from 'lodash';
import Tile from 'common/map/tile';
import TileColorIDs from '1846/config/tileColorIds';
import ko from 'knockout';
import ValidationError from 'common/game/validationError';

const TileDefinitions = {
    5: {
        id: 5,
        colorId: TileColorIDs.YELLOW,
        revenue: 20,
        connections: [[2, 7], [3, 7]]
    },
    6: {
        id: 6,
        colorId: TileColorIDs.YELLOW,
        revenue: 20,
        connections: [[1, 7], [3, 7]]
    },
    7: {
        id: 7,
        colorId: TileColorIDs.YELLOW,
        connections: [[2, 3]]
    },
    8: {
        id: 8,
        colorId: TileColorIDs.YELLOW,
        connections: [[1, 3]]
    },
    9: {
        id: 9,
        colorId: TileColorIDs.YELLOW,
        connections: [[0, 3]]
    },
    14: {
        id: 14,
        colorId: TileColorIDs.GREEN,
        revenue: 30,
        connections: [[0, 7], [2, 7], [3, 7], [5, 7]]
    },
    15: {
        id: 15,
        colorId: TileColorIDs.GREEN,
        revenue: 30,
        connections: [[0, 7], [1, 7], [2, 7], [3, 7]]
    },
    16: {
        id: 16,
        colorId: TileColorIDs.GREEN,
        connections: [[1, 3], [2, 4]]
    },
    17: {
        id: 17,
        colorId: TileColorIDs.GREEN
    },
    18: {
        id: 18,
        colorId: TileColorIDs.GREEN
    },
    19: {
        id: 19,
        colorId: TileColorIDs.GREEN
    },
    20: {
        id: 20,
        colorId: TileColorIDs.GREEN
    },
    21: {
        id: 21,
        colorId: TileColorIDs.GREEN
    },
    22: {
        id: 22,
        colorId: TileColorIDs.GREEN
    },
    23: {
        id: 23,
        colorId: TileColorIDs.GREEN
    },
    24: {
        id: 24,
        colorId: TileColorIDs.GREEN
    },
    25: {
        id: 25,
        colorId: TileColorIDs.GREEN
    },
    26: {
        id: 26,
        colorId: TileColorIDs.GREEN
    },
    27: {
        id: 27,
        colorId: TileColorIDs.GREEN
    },
    28: {
        id: 28,
        colorId: TileColorIDs.GREEN
    },
    29: {
        id: 29,
        colorId: TileColorIDs.GREEN
    },
    30: {
        id: 30,
        colorId: TileColorIDs.GREEN
    },
    31: {
        id: 31,
        colorId: TileColorIDs.GREEN
    },
    39: {
        id: 39,
        colorId: TileColorIDs.BROWN,
    },
    40: {
        id: 40,
        colorId: TileColorIDs.BROWN,
    },
    41: {
        id: 41,
        colorId: TileColorIDs.BROWN,
    },
    42: {
        id: 42,
        colorId: TileColorIDs.BROWN,
    },
    43: {
        id: 43,
        colorId: TileColorIDs.BROWN,
    },
    44: {
        id: 44,
        colorId: TileColorIDs.BROWN,
    },
    45: {
        id: 45,
        colorId: TileColorIDs.BROWN,
    },
    46: {
        id: 46,
        colorId: TileColorIDs.BROWN,
    },
    47: {
        id: 47,
        colorId: TileColorIDs.BROWN,
    },
    51: {
        id: 51,
        colorId: TileColorIDs.GRAY,
        revenue: 50,
    },
    57: {
        id: 57,
        colorId: TileColorIDs.YELLOW,
        revenue: 20,
        connections: [[0, 7], [3, 7]]
    },
    70: {
        id: 70,
        colorId: TileColorIDs.BROWN,
    },
    290: {
        id: 290,
        colorId: TileColorIDs.GRAY,
        revenue: 70,
        connections: [[0, 7], [1, 7], [3, 7], [4, 7], [5, 7]],
    },
    291: {
        id: 291,
        colorId: TileColorIDs.YELLOW,
        revenue: 40,
        connections: [[2, 7], [3, 7]]
    },
    292: {
        id: 292,
        colorId: TileColorIDs.YELLOW,
        revenue: 40,
        connections: [[1, 7], [3, 7]]
    },
    293: {
        id: 293,
        colorId: TileColorIDs.YELLOW,
        revenue: 40,
        connections: [[0, 7], [3, 7]]
    },
    294: {
        id: 294,
        colorId: TileColorIDs.GREEN,
        revenue: 50,
        connections: [[0, 7], [2, 7], [3, 7], [5, 7]]
    },
    295: {
        id: 295,
        colorId: TileColorIDs.GREEN,
        revenue: 50,
        connections: [[0, 7], [1, 7], [2, 7], [3, 7]]
    },
    296: {
        id: 296,
        colorId: TileColorIDs.GREEN,
        revenue: 50,
        connections: [[0, 7], [2, 7], [3, 7], [4, 7]]
    },
    297: {
        id: 297,
        colorId: TileColorIDs.BROWN,
        revenue: 60,
        connections: [[0, 7], [1, 7], [3, 7], [4, 7], [5, 7]]
    },
    298: {
        id: 298,
        colorId: TileColorIDs.GREEN,
        revenue: 40,
        connections: [[0, 7], [1, 7], [0, 8], [2, 8], [0, 9], [3, 9], [0, 10], [4, 10]]
    },
    299: {
        id: 299,
        colorId: TileColorIDs.BROWN,
        revenue: 70,
        connections: [[0, 7], [1, 7], [0, 8], [2, 8], [0, 9], [3, 9], [0, 10], [4, 10]]
    },
    300: {
        id: 300,
        colorId: TileColorIDs.GRAY,
        revenue: 90,
        connections: [[0, 7], [1, 7], [0, 8], [2, 8], [0, 9], [3, 9], [0, 10], [4, 10]],
    },
    611: {
        id: 611,
        colorId: TileColorIDs.BROWN,
        revenue: 40
    },
    619: {
        id: 619,
        colorId: TileColorIDs.GREEN,
        revenue: 30,
        connections: [[0, 7], [2, 7], [3, 7], [4, 7]]
    }
};

const Manifest = {
    5: {
        upgrades: [14, 15, 619],
        count: 3
    },
    6: {
        upgrades: [14, 15, 619],
        count: 4
    },
    7: {
        upgrades: [18,21,22,26,27,28,29,30,31],
        count: -1
    },
    8: {
        upgrades: [16, 17, 19, 21, 22, 23, 24, 25, 28, 29, 30, 31],
        count: -1
    },
    9: {
        upgrades: [18, 19, 20, 23, 24, 26, 27],
        count: -1
    },
    14: {
        upgrades: [611],
        count: 4
    },
    15: {
        upgrades: [611],
        count: 5
    },
    16: {
        upgrades: [43, 70],
        count: 2
    },
    17: {
        upgrades: [47],
        count: 1
    },
    18: {
        upgrades: [43],
        count: 1
    },
    19: {

        upgrades: [45,46],
        count: 2
    },
    20: {
        upgrades: [44,47],
        count: 2
    },
    21: {
        upgrades: [46],
        count: 1
    },
    22: {
        upgrades: [45],
        count: 1
    },
    23: {
        upgrades: [41,43,45,47],
        count: 4
    },
    24: {
        upgrades: [42, 43, 46, 47],
        count: 4
    },
    25: {
        upgrades: [40, 45, 46],
        count: 2
    },
    26: {
        upgrades: [42, 44, 45],
        count: 1
    },
    27: {
        upgrades: [41,44,46],
        count: 1
    },
    28: {
        upgrades: [39,43,46,70],
        count: 1
    },
    29: {
        upgrades: [39, 43, 45, 70],
        count: 1
    },
    30: {
        upgrades: [42, 70],
        count: 1
    },
    31: {
        upgrades: [41, 70],
        count: 1
    },
    39: {
        count: 1
    },
    40: {
        count: 1
    },
    41: {
        count: 2
    },
    42: {
        count: 2
    },
    43: {
        count: 2
    },
    44: {
        count: 1
    },
    45: {
        count: 2
    },
    46: {
        count: 2
    },
    47: {
        count: 2
    },
    51: {
        count: 2
    },
    57: {
        upgrades: [14, 15, 619],
        count: 4
    },
    70: {
        count: 1
    },
    290: {
        count: 1
    },
    291: {
        upgrades: [294, 295, 296],
        count: 1
    },
    292: {
        upgrades: [294, 295, 296],
        count: 1
    },
    293: {
        upgrades: [294, 295, 296],
        count: 1
    },
    294: {
        upgrades: [297],
        count: 2
    },
    295: {
        upgrades: [297],
        count: 2
    },
    296: {
        upgrades: [297],
        count: 1
    },
    297: {
        upgrades: [290],
        count: 2
    },
    298: {
        upgrades: [299],
        count: 1
    },
    299: {
        upgrades: [300],
        count: 1
    },
    300: {
        count: 1
    },
    611: {
        upgrades: [51],
        count: 1
    },
    619: {
        upgrades: [611],
        count: 3
    }
};

class TileManifest {
    constructor(definition) {
        definition = definition || {};
        this.TileColorIDs = TileColorIDs;

        this.availableTiles = ko.observable(definition.availableTiles || _.mapValues(Manifest, 'count'));
        this.tilesByColor = ko.computed(()=> {
            return _(TileDefinitions).map((tileDefinition)=> {
                return {
                    id: tileDefinition.id,
                    colorId: tileDefinition.colorId,
                    upgrades: Manifest[tileDefinition.id].upgrades,
                    remaining: this.availableTiles()[tileDefinition.id]
                }
            }).groupBy('colorId').value();
        });
        this.activeTileSet = ko.observable(TileColorIDs.YELLOW);
        this.activeTiles = ko.computed(()=> {
            return this.tilesByColor()[this.activeTileSet()] || [];
        });

        this.popoverParams = {
            placement: 'right',
            content: '<div style="width:270px;" data-bind="template: { name: \'tileUpgradePopover\' }"></div>'
        };

    }

    setActiveTileSet(colorId) {
        this.activeTileSet(colorId);
    }

    getUpgradesForTile(id) {
        return _(Manifest[id].upgrades || []).map((upgradeId) => {
            return {
                id: upgradeId,
                remaining: this.availableTiles()[upgradeId]
            }
        }).value();
    }

    getTile(id, replacedId) {
        const numAvailable = this.availableTiles()[id];
        if(numAvailable === 0) {
            throw ValidationError('No '+ id + ' tile available');
        }
        else if(numAvailable > 0) {
            this.availableTiles()[id] = numAvailable-1;
        }

        if(replacedId) {
            const isUnlimited = this.availableTiles()[replacedId] === -1;
            if(!isUnlimited) {
                this.availableTiles()[id] = numAvailable+1;
            }
        }

        return this.createTile(id);
    }

    createTile(id) {
        const definition = _.clone(TileDefinitions[id]);
        definition['upgrades'] = Manifest[id].upgrades;
        return new Tile(definition);
    }
}

export default TileManifest;