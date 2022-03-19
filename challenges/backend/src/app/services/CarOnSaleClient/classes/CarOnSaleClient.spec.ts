import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { faker } from "@faker-js/faker";
import { AxiosInstance, AxiosError } from "axios";

import { CarOnSaleClient } from "./CarOnSaleClient";
import { ICosConfig } from "../dtos";
import { ILogger } from "../../Logger/interface/ILogger";

describe("CarOnSaleClient Tests", () => {
  let sandbox: SinonSandbox;
  let axiosInstance: AxiosInstance;
  let logger: ILogger;
  let carOnSaleClient: CarOnSaleClient;
  let cosConfig: ICosConfig;

  beforeEach(() => {
    sandbox = createSandbox();
    axiosInstance = {} as AxiosInstance;
    logger = {} as ILogger;
    cosConfig = {
      baseURL: faker.internet.url(),
      userEmail: faker.internet.email(),
      password: faker.random.alphaNumeric(),
    };

    carOnSaleClient = new CarOnSaleClient(cosConfig, logger, () => axiosInstance);
  });

  describe("logError", () => {
    it("should log error when its an axios error", async () => {
      // Arrange
      const stubRequestName = 'Test'
      const stubError = {
        isAxiosError: true,
        response: {
          status: faker.datatype.number(),
          data: {
            message: faker.random.alpha()
          }
        }
      } as AxiosError;
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub

      // Act
      carOnSaleClient.logError(stubRequestName, stubError)

      // Assert
      expect(loggerErrorStub.calledOnce).to.equal(true);
      expect(loggerErrorStub.calledOnceWithExactly(`${stubRequestName} returned status ${stubError.response?.status} with message '${stubError.response?.data.message}'.`)).to.equal(true);
    });

    it("should log error when its a generic error", async () => {
      // Arrange
      const stubRequestName = 'Test'
      const stubError = {
        message: faker.random.alpha()
      } as Error;
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub

      // Act
      carOnSaleClient.logError(stubRequestName, stubError)

      // Assert
      expect(loggerErrorStub.calledOnce).to.equal(true);
      expect(loggerErrorStub.calledOnceWithExactly(`${stubRequestName} failed with message '${stubError.message}'.`)).to.equal(true);
    });
  });

  describe("getAuthenticationHeader", () => {
    it("should call logger and axios instance and return authentication header", async () => {
      // Arrange
      const stubPut = {
        data: {
          token: faker.random.alphaNumeric(),
          userId: faker.datatype.number()
        }
      };
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub
      const axiosInstancePutStub = sandbox.stub().returns(stubPut);
      axiosInstance.put = axiosInstancePutStub

      // Act
      const result = await carOnSaleClient.getAuthenticationHeader()

      // Assert
      expect(loggerLogStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnceWithExactly(`/api/v1/authentication/${cosConfig.userEmail}`,
        {
          "password": cosConfig.password,
          "meta": null,
        })).to.equal(true);
      expect(result.authtoken).to.equal(stubPut.data.token)
      expect(result.userid).to.equal(stubPut.data.userId)
    });

    it("should log error when integration failed", async () => {
      // Arrange
      const stubError = {
        isAxiosError: true,
        response: {
          status: faker.datatype.number(),
          data: {
            message: faker.random.alpha()
          }
        }
      } as AxiosError;
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub
      const axiosInstancePutStub = sandbox.stub().throws(stubError);
      axiosInstance.put = axiosInstancePutStub

      // Act
      try {
        await carOnSaleClient.getAuthenticationHeader()
      } catch (e) {
        expect(e).to.equal(stubError);
      }

      // Assert
      expect(loggerLogStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnceWithExactly(`/api/v1/authentication/${cosConfig.userEmail}`,
        {
          "password": cosConfig.password,
          "meta": null,
        })).to.equal(true);
      expect(loggerErrorStub.calledOnce).to.equal(true);
      expect(loggerErrorStub.calledOnceWithExactly(`COS Authentication returned status ${stubError.response?.status} with message '${stubError.response?.data.message}'.`)).to.equal(true);
    });
  });

  describe("getRunningAuctions", () => {
    it("should call logger, getAuthenticationHeader and axios and return running actions", async () => {
      // Arrange
      const stubGet = {
        data: {
          items: [],
          page: faker.datatype.number(),
          total: faker.datatype.number(),
        }
      };
      const stubPut = {
        data: {
          token: faker.random.alphaNumeric(),
          userId: faker.datatype.number()
        }
      };
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub;
      const axiosInstancePutStub = sandbox.stub().returns(stubPut);
      axiosInstance.put = axiosInstancePutStub;
      const axiosInstanceGetStub = sandbox.stub().returns(stubGet);
      axiosInstance.get = axiosInstanceGetStub;

      // Act
      const result = await carOnSaleClient.getRunningAuctions();

      // Assert
      expect(loggerLogStub.calledTwice).to.equal(true);
      expect(axiosInstancePutStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnceWithExactly(`/api/v1/authentication/${cosConfig.userEmail}`,
        {
          "password": cosConfig.password,
          "meta": null,
        })).to.equal(true);
      expect(axiosInstanceGetStub.calledOnce).to.equal(true);
      expect(axiosInstanceGetStub.calledOnceWithExactly(`/api/v2/auction/buyer/`,
        {
          headers: {
            authtoken: stubPut.data.token,
            userid: stubPut.data.userId,
          },
          params: {
            filter: null,
            count: false,
          }
        })).to.equal(true);
      expect(result.items).to.equal(stubGet.data.items);
      expect(result.page).to.equal(stubGet.data.page);
      expect(result.total).to.equal(stubGet.data.total);
    });

    it("should log error when integration failed", async () => {
      // Arrange
      const stubError = {
        isAxiosError: true,
        response: {
          status: faker.datatype.number(),
          data: {
            message: faker.random.alpha()
          }
        }
      } as AxiosError;
      const stubPut = {
        data: {
          token: faker.random.alphaNumeric(),
          userId: faker.datatype.number()
        }
      };
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub;
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub;
      const axiosInstancePutStub = sandbox.stub().returns(stubPut);
      axiosInstance.put = axiosInstancePutStub;
      const axiosInstanceGetStub = sandbox.stub().throws(stubError);
      axiosInstance.get = axiosInstanceGetStub;

      // Act
      try {
        await carOnSaleClient.getRunningAuctions()
      } catch (e) {
        expect(e).to.equal(stubError);
      }

      // Assert
      expect(loggerLogStub.calledTwice).to.equal(true);
      expect(axiosInstancePutStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnceWithExactly(`/api/v1/authentication/${cosConfig.userEmail}`,
        {
          "password": cosConfig.password,
          "meta": null,
        })).to.equal(true);
      expect(axiosInstanceGetStub.calledOnce).to.equal(true);
      expect(axiosInstanceGetStub.calledOnceWithExactly(`/api/v2/auction/buyer/`,
        {
          headers: {
            authtoken: stubPut.data.token,
            userid: stubPut.data.userId,
          },
          params: {
            filter: null,
            count: false,
          }
        })).to.equal(true);
      expect(loggerErrorStub.calledOnce).to.equal(true);
      expect(loggerErrorStub.calledOnceWithExactly(`COS Get Auctions returned status ${stubError.response?.status} with message '${stubError.response?.data.message}'.`)).to.equal(true);
    });

    it("should log error when getAuthenticationHeader integration failed", async () => {
      // Arrange
      const stubError = {
        isAxiosError: true,
        response: {
          status: faker.datatype.number(),
          data: {
            message: faker.random.alpha()
          }
        }
      } as AxiosError;
      const loggerLogStub = sandbox.stub();
      logger.log = loggerLogStub;
      const loggerErrorStub = sandbox.stub();
      logger.error = loggerErrorStub;
      const axiosInstancePutStub = sandbox.stub().throws(stubError);
      axiosInstance.put = axiosInstancePutStub;
      const axiosInstanceGetStub = sandbox.stub();
      axiosInstance.get = axiosInstanceGetStub;

      // Act
      try {
        await carOnSaleClient.getRunningAuctions();
      } catch (e) {
        expect(e).to.equal(stubError);
      }

      // Assert
      expect(loggerLogStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnce).to.equal(true);
      expect(axiosInstancePutStub.calledOnceWithExactly(`/api/v1/authentication/${cosConfig.userEmail}`,
        {
          "password": cosConfig.password,
          "meta": null,
        })).to.equal(true);
      expect(axiosInstanceGetStub.notCalled).to.equal(true);
      expect(loggerErrorStub.calledTwice).to.equal(true);
      expect(loggerErrorStub.calledWithExactly(`COS Authentication returned status ${stubError.response?.status} with message '${stubError.response?.data.message}'.`)).to.equal(true);
      expect(loggerErrorStub.calledWithExactly(`COS Get Auctions returned status ${stubError.response?.status} with message '${stubError.response?.data.message}'.`)).to.equal(true);
    });
  });
});