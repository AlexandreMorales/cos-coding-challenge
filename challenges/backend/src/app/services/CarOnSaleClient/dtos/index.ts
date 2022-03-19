import { IApiConfig } from '../../../dtos'

export interface ICosConfig extends IApiConfig {
  userEmail: string | undefined
  password: string | undefined
}

export interface ICosAuthenticationResponse {
  token: string
  authenticated: boolean
  userId: string
  internalUserId: number
  internalUserUUID: string
  type: number
  privileges: string
}

export interface ICosAuthenticationHeader {
  authtoken: string
  userid: string
}

export interface ICosPage<T> {
  items: T[]
  page: number
  total: number
}

export interface ICosAuction {
  id: number
  label: string
  endingTime: string
  state: number
  minimumRequiredAsk: number
  currentHighestBidValue: number
  numBids: number
  locationAddress: string
  locationCity: string
  locationZip: string
  startedAt: string
  createdAt: string
  updatedAt: string
  hotBid: boolean
  originalMinimumRequiredAsk: number
  allowInstantPurchase: boolean
  instantPurchasePossibleUntil: string
  advertisementHtmlContent: string
  instantPurchasePrice: number
  locationCountryCode: string
  startingBidValue: number
  uuid: string
  _fk_uuid_vehicle: string
  _fk_uuid_sellerUser: string
  _fk_uuid_highestBiddingBuyerUser: string
  urlToPickupBuyerDocument: string
  paymentProcess: number
  type: number
  _fk_uuid_creatingSellerUser: string
  isTest: boolean
  displayMinAsk: boolean
  isLive: boolean
  isTransportationDisabledManually: boolean
  startingBidValueNet: number
  minimumRequiredAskNet: number
  originalMinimumRequiredAskNet: number
  purchasePriceNet: number
  currentHighestBidValueNet: number
  highestBidValueAtEndingTimeNet: number
  instantPurchasePriceNet: number
  lastOfferBySellerNet: number
  previousLastOfferBySellerNet: number
  counterOfferByBuyerNet: number
  previousCounterOfferByBuyerNet: number
  renegotiationMidpointValueNet: number
  pickupInstructions: string
  thirdPartyVATDepositTransferReference: number
  thirdPartyVATDepositChargeReference: number
  preventSellerFactoring: boolean
  listingSurchargeFeeInvoiceReference: number
  additionalTaxType: number
  additionalTaxValue: number
  isVATReportable: boolean
  thirdPartyAdditionalTaxRefundReference: number
  uploadMethod: number
  amIInvolved: boolean
  biddingAgentValue: number
  remainingTimeInSeconds: number
  remainingTimeForInstantPurchaseInSeconds: number
  associatedVehicle: object
  amIHighestBidder: boolean
  sellerContact: string
  rating: number
  isTransportationAllowedForRegion: boolean
  isExternalPaymentAllowed: boolean
  remainingDaysUntilReauctioning: number
  remainingDaysUntilLatePickup: number
  latePickupFee: number
  isTransportationBookingPossible: boolean
  isExpressPickupAvailable: boolean
  pickupPossibleInDays: number
  sellerAccount: object
  amIRegularBuyer: boolean
  isCrossBorderNetSale: boolean
  distanceToVehicleInKms: number
  buyerPurchaseFee: number
  buyerSuccessFee: number
  vatAmount: number
  vatRate: number
  isMinAskReached: boolean
  transportationTask: string
  sellerType: number
  enforceTransportation: boolean
  isTransportationAvailable: false
}