import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { ICarOnSaleClient } from "../interface";
import { ICosConfig, ICosAuthenticationResponse, ICosAuthenticationHeader, ICosAuction, ICosPage } from "../dtos";
import { ILogger } from "../../Logger/interface/ILogger";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  private readonly httpClient: AxiosInstance;

  public constructor(
    @inject(DependencyIdentifier.COS_CONFIG) private readonly config: ICosConfig,
    @inject(DependencyIdentifier.LOGGER) private readonly logger: ILogger
  ) {
    this.httpClient = axios.create({
      baseURL: config.baseURL
    })
  }

  public logError(requestName: string, e: any) {
    if (axios.isAxiosError(e)) {
      const { response } = e as AxiosError;
      this.logger.error(`${requestName} returned status ${response?.status} with message '${response?.data.message}'.`);
    } else {
      this.logger.error(`${requestName} failed.`);
    }
  }

  private async encapsulateLoader(callback: () => Promise<void>) {
    const loader = ["\\", "|", "/", "-"];
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write("\r" + loader[i]);
      i = (i + 1) % loader.length;
    }, 250);

    try {
      await callback()
    } finally {
      clearInterval(interval)
      process.stdout.write("\r");
    }
  }

  public async getAuthenticationHeader(): Promise<ICosAuthenticationHeader> {
    try {
      this.logger.log(`Getting authentication for user '${this.config.userEmail}'.`);
      let response: AxiosResponse | undefined;

      await this.encapsulateLoader(async () => {
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
      process.exit(-1);
    }
  }

  public async getRunningAuctions(): Promise<ICosPage<ICosAuction>> {
    try {
      const authConfig = await this.getAuthenticationHeader();

      this.logger.log(`Retriving auctions.`);
      let response: AxiosResponse | undefined;

      await this.encapsulateLoader(async () => {
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
      this.logError('COS Get Auctions', e)
      process.exit(-1);
    }
  }
}