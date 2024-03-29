import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RequestContextMiddleware } from './custom-middleware/request-context.middleware';
import { config } from './ormconfig';
import { IngredientsModule } from './resources/ingredients/ingredients.module';
import { RecipeModule } from './resources/recipe/recipe.module';
import { UserModule } from './resources/user/user.module';
import { NutritionixModule } from './resources/nutritionix/nutritionix.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return config;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      }
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    RecipeModule,
    IngredientsModule,
    NutritionixModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
