import { config } from "dotenv";
// import path from "path";
import { Container } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface";
import { ICosConfig } from "./services/CarOnSaleClient/dtos";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes";
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

container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICarOnSaleClient>(DependencyIdentifier.COS_CLIENT).to(CarOnSaleClient);


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
