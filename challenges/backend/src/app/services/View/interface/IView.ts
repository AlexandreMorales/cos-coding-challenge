import { IAuctionsStatistics } from '../../../domain/Auctions/dtos'

/**
 * This service describes an interface to show the data for monitor app.
 */
export interface IView {

    showAuctionsStatistics(auctionsStatistics: IAuctionsStatistics): void

}
