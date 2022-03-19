import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { ICarOnSaleClient } from "../interface";
import { ICosConfig, ICosAuthenticationResponse, ICosAuthenticationHeader, ICosAuction, ICosPage } from "../dtos";
import { ILogger } from "../../Logger/interface/ILogger";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { IApiConfig } from "../../../dtos";
import { encapsulateLoader } from "../../../helpers";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  private readonly httpClient: AxiosInstance;

  public constructor(
    @inject(DependencyIdentifier.COS_CONFIG) private readonly config: ICosConfig,
    @inject(DependencyIdentifier.LOGGER) private readonly logger: ILogger,
    @inject(DependencyIdentifier.HTTP_CLIENT) httpClientFactory: (config: IApiConfig) => AxiosInstance,
  ) {
    this.httpClient = httpClientFactory(config)
  }

  public logError(requestName: string, e: any): void {
    if (axios.isAxiosError(e)) {
      const { response } = e as AxiosError;
      this.logger.error(`${requestName} returned status ${response?.status} with message '${response?.data?.message}'.`);
    } else {
      const { message } = e as Error;
      this.logger.error(`${requestName} failed with message '${message}'.`);
    }
  }

  public async getAuthenticationHeader(): Promise<ICosAuthenticationHeader> {
    try {
      this.logger.log(`Getting COS authentication for user '${this.config.userEmail}'.`);
      let response: AxiosResponse | undefined;

      await encapsulateLoader(async () => {
        response = await this.httpClient.put(`/api/v1/authentication/${this.config.userEmail}`,
          {
            "password": this.config.password,
            "meta": null,
          });
      });

      const { token, userId } = response?.data as ICosAuthenticationResponse;

      return {
        authtoken: token,
        userid: userId,
      };
    } catch (e) {
      this.logError('COS Authentication', e);
      throw e;
    }
  }

  public async getRunningAuctions(): Promise<ICosPage<ICosAuction>> {
    try {
      const authConfig = await this.getAuthenticationHeader();

      this.logger.log(`Retriving COS auctions.`);
      let response: AxiosResponse | undefined;

      await encapsulateLoader(async () => {
        response = await this.httpClient.get(`/api/v2/auction/buyer/`,
          {
            headers: { ...authConfig },
            params: {
              filter: null,
              count: false,
            }
          });
      });

      return response?.data as ICosPage<ICosAuction>;
    } catch (e) {
      this.logError('COS Get Auctions', e);
      throw e;
    }
  }
}