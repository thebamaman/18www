import Action from 'common/game/action';
import Prices from '1846/config/prices';
import ValidationError from 'common/game/validationError';

class SellShares extends Action {

    constructor(args) {
        super(args);

        this.playerId = args.playerId;
        this.companyId = args.companyId;
        this.count = args.count;
        this.startIndex = args.startIndex;
        this.endIndex = args.endIndex;
        this.forced = args.forced;
        this.newPresidentId = args.newPresidentId;
        this.firstPassIndex = args.firstPassIndex;
        this.oldCompaniesForPriceIndex= args.oldCompaniesForPriceIndex;
        this.closeData = args.closeData;
    }

    doExecute(state) {
        const player = state.playersById()[this.playerId];
        const company = state.getCompany(this.companyId);
        const isPresident = company.president() === this.playerId;
        this.startIndex = company.priceIndex();
        this.oldCompaniesForPriceIndex = state.stockBoard.getCompaniesForPriceIndex(this.startIndex);

        // validate things
        // company has operated or is pres
        // owns shares
        // market space
        // presidency requirement

        state.firstPassIndex(null);
        this.endIndex = isPresident ? Prices.leftIndex(this.startIndex) : this.startIndex;
        company.priceIndex(this.endIndex);
        const cash = Prices.price(this.startIndex) * this.count;
        state.bank.removeCash(cash);
        player.addCash(cash);

        if(this.endIndex === 0) {
            this.closeData = company.close();
        }
        else {
            if (isPresident && player.sharesPerCompany()[this.companyId] - this.count < 2) {
                // Swap director cert
                const target = _(state.players()).filter(
                    otherPlayer => player.id !== otherPlayer.id && otherPlayer.sharesPerCompany()[this.companyId] >= 2).sortBy(
                    otherPlayer => {
                        return otherPlayer.order() > player.order() ? otherPlayer.order() : otherPlayer.order() + 10;
                    }).first();

                if (!target) {
                    throw new ValidationError('Cannot find player to dump company on');
                }

                const nonPresidentCerts = target.removeNonPresidentCertsForCompany(2, this.companyId);
                const presidentCert = player.removePresidentCertForCompany(this.companyId);

                target.addCert(presidentCert);
                player.addCerts(nonPresidentCerts);

                this.newPresidentId = target.id;
                company.president(target.id);
            }

            const certs = player.removeNonPresidentCertsForCompany(this.count, this.companyId);
            state.bank.certificates.push.apply(state.bank.certificates, certs);
        }

    }

    doUndo(state) {
        const player = state.playersById()[this.playerId];
        const company = state.getCompany(this.companyId);

        const cash = Prices.price(this.startIndex) * this.count;
        state.bank.addCash(cash);
        player.removeCash(cash);
        company.priceIndex(this.startIndex);
        state.stockBoard.setCompaniesForPriceIndex(this.startIndex, this.oldCompaniesForPriceIndex);
        state.firstPassIndex(this.firstPassIndex);

        if(this.closeData) {
            company.unclose(this.closeData);
        }
        else {
            const certs = state.bank.removeNonPresidentCertsForCompany(this.count, this.companyId);
            player.addCerts(certs);

            if (this.newPresidentId) {
                const newPresident = state.playersById()[this.newPresidentId];
                const nonPresidentCerts = player.removeNonPresidentCertsForCompany(2, this.companyId);
                const presidentCert = newPresident.removePresidentCertForCompany(this.companyId);

                player.addCert(presidentCert);
                newPresident.addCerts(nonPresidentCerts);
                company.president(player.id);
            }
        }


    }

    summary(state) {
        const company = state.getCompany(this.companyId);
        return 'Sold ' + this.count + ' ' + company.nickname + ' @ ' + Prices.price(this.startIndex) + (this.closeData ? ' closing the company': '');
    }

    confirmation(state) {
        const company = state.getCompany(this.companyId);
        const isPresident = company.president() === this.playerId;
        const endIndex = isPresident ? Prices.leftIndex(this.startIndex) : this.startIndex;
        return 'Sell ' + this.count + ' ' + company.nickname + ' @ ' + Prices.price(company.priceIndex()) + (endIndex ? ' closing the company': '');
    }

}

SellShares.registerClass();

export default SellShares