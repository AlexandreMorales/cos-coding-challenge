import { config } from "dotenv";
import { Container } from "inversify";
import axios, { AxiosInstance } from "axios";
import { IApiConfig } from "./dtos";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface";
import { ICosConfig } from "./services/CarOnSaleClient/dtos";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes";
import { IView } from "./services/View/interface";
import { View } from "./services/View/classes";
import { IAuctionService } from "./domain/Auctions/interface";
import { AuctionService } from "./domain/Auctions/classes";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { AuctionMonitorApp } from "./AuctionMonitorApp";

config()

/*
 * Create the DI container.
 */
const container = new Container({
	defaultScope: "Singleton",
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ICosConfig>(DependencyIdentifier.COS_CONFIG).toConstantValue({
	baseURL: process.env.CARONSALE_URL,
	userEmail: process.env.CARONSALE_USER_EMAIL,
	password: process.env.CARONSALE_PASSWORD,
});

container.bind<AxiosInstance>(DependencyIdentifier.HTTP_CLIENT).toFactory(_ => (apiConfig: IApiConfig) => axios.create({
	baseURL: apiConfig.baseURL
}));
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICarOnSaleClient>(DependencyIdentifier.COS_CLIENT).to(CarOnSaleClient);
container.bind<IAuctionService>(DependencyIdentifier.AUCTIONS).to(AuctionService);
container.bind<IView>(DependencyIdentifier.VIEW).to(View);

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
	await app.start();
})();
