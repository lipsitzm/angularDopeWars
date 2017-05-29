import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PubSubModule } from 'angular2-pubsub';

import { AppComponent } from './app.component';
import { NavBar } from './navBar';
import { Day } from './day.component';
import { Game } from './game.component';
import { Player } from './player.component';
import { CityList } from './cityList.component';
import { City } from './city.component';
import { DrugList } from './drugList.component';
import { FooterBar } from './footerBar.component';
import {SurpriseContent} from '../modals/surprise.component';
import {DrugTransactionComponent} from '../modals/drugTransaction.component';
import {DrugTransactionDirective} from '../modals/drugTransaction.directive';
import {LoanDebtContent} from '../modals/debt.component'
import {BuyDrugContent} from '../modals/buyDrug.component'
import {SellDrugContent} from '../modals/sellDrug.component'
import {TransactionChooserContent} from '../modals/transactionChooser.component'
import {TransactionIssueContent} from '../modals/transactionIssue.component'

import {GameEngine} from '../engines/gameEngine';

import {DayService} from '../services/dayService';
import {DifficultyLevelsService} from '../services/difficultyService';
import {CityService} from '../services/cityService';
import {DrugService} from '../services/drugService';
import {PlayerService} from '../services/playerService';
import {SurpriseService} from '../services/surpriseService';

import {PercentFormatPipe} from '../pipes/percentFormatPipe';
import {CustomCurrencyPipe} from '../pipes/customCurrencyPipe';

import { MinValueValidatorDirective } from '../validators/min-value.directive';
import { MaxValueValidatorDirective } from '../validators/max-value.directive';

const appRoutes: Routes = [

  { path: 'game/:totalDays/:difficultyLevel', component: Game },
  { path: '**', component: Game }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBar,
    CustomCurrencyPipe,
    PercentFormatPipe,
    Game,
    Day,
    Player,
    CityList,
    City,
    DrugList,
    FooterBar,
    LoanDebtContent,
    SurpriseContent,
    DrugTransactionComponent,
    DrugTransactionDirective,
    BuyDrugContent,
    SellDrugContent,
    TransactionIssueContent,
    TransactionChooserContent,
    MinValueValidatorDirective,
    MaxValueValidatorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PubSubModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    GameEngine,
    DayService,
    DifficultyLevelsService,
    CityService,
    DrugService,
    PlayerService,
    SurpriseService
  ],
  entryComponents: [
    SurpriseContent,
    DrugTransactionComponent,
    LoanDebtContent,
    BuyDrugContent,
    SellDrugContent,
    TransactionIssueContent,
    TransactionChooserContent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
