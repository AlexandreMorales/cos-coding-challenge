import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { faker } from "@faker-js/faker";

import { AuctionService } from "./AuctionService";
import { ILogger } from "../../../services/Logger/interface/ILogger";
import { ICarOnSaleClient } from "../../../services/CarOnSaleClient/interface";
import { ICosPage, ICosAuction } from "../../../services/CarOnSaleClient/dtos";

const FAKE_AUCTIONS = [
  { numBids: 1, currentHighestBidValue: 20, minimumRequiredAsk: 100 },
  { numBids: 0, currentHighestBidValue: 10, minimumRequiredAsk: 200 },
  { numBids: 3, currentHighestBidValue: 50, minimumRequiredAsk: 1000 },
  { numBids: 5, currentHighestBidValue: 1, minimumRequiredAsk: 10 },
] as ICosAuction[];
const FAKE_AUCTIONS_BID_SUM = 9;
const FAKE_AUCTIONS_PROGRESS_SUM = 40;

describe("AuctionService Tests", () => {
  let sandbox: SinonSandbox;
  let logger: ILogger;
  let carOnSaleClient: ICarOnSaleClient;
  let auctionService: AuctionService;

  beforeEach(() => {
    sandbox = createSandbox();
    logger = {} as ILogger;
    carOnSaleClient = {} as ICarOnSaleClient;

    auctionService = new AuctionService(logger, carOnSaleClient);
  });

  describe("getAuctionsBidSum", () => {
    it("should return actions bid sum", async () => {
      // Act
      const result = auctionService.getAuctionsBidSum(FAKE_AUCTIONS);

      // Assert
      expect(result).to.equal(FAKE_AUCTIONS_BID_SUM);
    });
  });

  describe("getAuctionsProgressSum", () => {
    it("should return actions progress sum", async () => {
      // Act
      const result = auctionService.getAuctionsProgressSum(FAKE_AUCTIONS);

      // Assert
      expect(result).to.equal(FAKE_AUCTIONS_PROGRESS_SUM);
    });
  });

  describe("getAuctionsStatistics", () => {
    it("should call cosClient and logger and return auctions statistics", async () => {
      // Arrange
      const stubRunningAuctions: ICosPage<ICosAuction> = {
        items: FAKE_AUCTIONS,
        page: faker.datatype.number(),
        total: faker.datatype.number(),
      };
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub;
      const carOnSaleClientGetRunningAuctionsStub = sandbox.stub().returns(stubRunningAuctions);
      carOnSaleClient.getRunningAuctions = carOnSaleClientGetRunningAuctionsStub;

      // Act
      const result = await auctionService.getAuctionsStatistics();

      // Assert
      expect(loggerLogStub.calledOnce).to.equal(true);
      expect(carOnSaleClientGetRunningAuctionsStub.calledOnce).to.equal(true);
      expect(carOnSaleClientGetRunningAuctionsStub.calledOnceWithExactly()).to.equal(true);
      expect(result.totalAuctions).to.equal(stubRunningAuctions.total);
      expect(result.auctionsBidSum).to.equal(FAKE_AUCTIONS_BID_SUM);
      expect(result.auctionsBidAverage).to.equal(FAKE_AUCTIONS_BID_SUM / stubRunningAuctions.total);
      expect(result.auctionsProgressSum).to.equal(FAKE_AUCTIONS_PROGRESS_SUM);
      expect(result.auctionsProgressAverage).to.equal(FAKE_AUCTIONS_PROGRESS_SUM / stubRunningAuctions.total);
    });

    it("should log error when calculation failed", async () => {
      // Arrange
      const stubRunningAuctions = undefined;
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub;
      const carOnSaleClientGetRunningAuctionsStub = sandbox.stub().returns(stubRunningAuctions);
      carOnSaleClient.getRunningAuctions = carOnSaleClientGetRunningAuctionsStub;

      // Act
      try {
        await auctionService.getAuctionsStatistics();
      } catch (e) {
        const { message } = e as Error;
        expect(message).to.equal("Cannot read properties of undefined (reading 'total')");
      }

      // Assert
      expect(carOnSaleClientGetRunningAuctionsStub.calledOnce).to.equal(true);
      expect(carOnSaleClientGetRunningAuctionsStub.calledOnceWithExactly()).to.equal(true);
      expect(loggerErrorStub.calledOnce).to.equal(true);
      expect(loggerErrorStub.calledOnceWithExactly(`Error occured on getAuctionsStatistics with message 'Cannot read properties of undefined (reading 'total')'.`)).to.equal(true);
    });
  });
});