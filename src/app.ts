import {
    Application, Loader, Resource, Sprite, Text, Texture, Ticker,
} from 'pixi.js';
import {TextInput} from "./app/visual-elements/text-input";
import {Button} from "./app/visual-elements/button";
import {ScreenFactory} from "./models/screen-factory";
import {ProgressElement} from "./app/visual-elements/progress";
import {ease} from "pixi-ease";

// constants
const SIZE = 512;

// https://newsapi.org/s/israel-news-api - API на который я кидаю запросы
// create and append app
const app = new Application({
    width: SIZE,
    height: SIZE,
    backgroundColor: 0x1099bb, // light blue
    sharedTicker: true,
    sharedLoader: true,
});
document.body.appendChild(app.view);
document.body.style.backgroundColor = '#1f4954'
const loader = Loader.shared;
const ticker = Ticker.shared;

// preload needed assets
loader.add('samir', '/assets/img/hero.png');
loader.add('logo', '/assets/img/hisahonFinanceLogo.png');
loader.add('card', '/assets/img/card.png');

const marketingText = new Text('Best services of Israel', {fill: 0x0, align: 'center', fontSize: 35});
marketingText.x = 125;
marketingText.y = 26;

const bar = new ProgressElement({
    y: SIZE,
    width: SIZE
});

const teudatZeutsWithFreezenAccounts = ['684567856', '839483485', '384859495', '384262495', '384854565', '675459495', '356759495']
const freezedAccountsCount = {
    '684567856': 4,
    '839483485': 2,
    '384859495': 3,
    '384262495': 2,
    '384854565': 1,
    '675459495': 4,
    '356759495': 2
}
const freezedAccountsInfo = {
    '684567856': `
    1. Arab Israel Bank.\nAccount №12752424. Employee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424. Employee: IVC Research Center\n
    3. Bank of Jerusalem.\nAccount №1345424. Employee: Boston Scientific\n
    4. Bank of Jerusalem.\nAccount №6568566. Employee: Voyager Labs`,

    '839483485': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424.\nEmployee: IVC Research Center\n`,

    '384859495': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424.\nEmployee: IVC Research Center\n
    3. Bank of Jerusalem.\nAccount №1345424.\nEmployee: Boston Scientific\n`,

    '384262495': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424.\nEmployee: IVC Research Center\n`,

    '384854565': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n`,

    '675459495': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424.\nEmployee: IVC Research Center\n
    3. Bank of Jerusalem.\nAccount №1345424.\nEmployee: Boston Scientific\n
    4. Bank of Jerusalem.\nAccount №6568566.\nEmployee: Voyager Labs`,

    '356759495': `
    1. Arab Israel Bank.\nAccount №12752424.\nEmployee: Outposter\n
    2. Mercantile Discount Bank.\nAccount №1456424.\nEmployee: IVC Research Center\n`
}
let enteredTeudatZeut: string = '684567856';

// when loader is ready
const factory = new ScreenFactory(app.stage);

loader.load(showStartScreen);

function showStartScreen() {
    // create and append FPS text
    // const fps = new Text('FPS: 0', { fill: 0xffffff });
    // app.stage.addChild(fps);

    // create and append hero
    // const heroTexture = loader.resources.samir.texture as Texture<Resource>;
    // const hero = createEntity(heroTexture, CENTER, CENTER);
    // app.stage.addChild(hero.sprite);

    // animate hero each "tick": go left or right continuously
    // ticker.add(() => {
    //   fps.text = `FPS: ${ticker.FPS.toFixed(2)}`;
    //   hero.direction = getNextEntityDirection(app.view.width, hero);
    //   hero.sprite.x = getNextEntityPosition(hero);
    // });

    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const input = new TextInput({
        input: {fontSize: '25px'},
        box: {fill: 0xEEEEEE},
        x: 100,
        y: 350
    })

    const autorizeText = new Text('Enter your teudat zeut', {fill: 0xf0f0f0, align: 'center', fontSize: 35});
    autorizeText.x = 90;
    autorizeText.y = 210;

    const continueButton = new Button({
        x: 260,
        y: 420,
        label: 'Continue',
        stroke: '#336699',
        strokeThickness: 4
    })
    continueButton.interactive = true;
    continueButton.on('pointerup', () => {
        enteredTeudatZeut = input.text;
        bar.showProgressLine(validateTeudatZeut.bind(this));
    })

    factory.showScreen('startPage', [continueButton, autorizeText, input, logo, marketingText, bar]);
} // DONE

function validateTeudatZeut() {
    if (!teudatZeutsWithFreezenAccounts.includes(enteredTeudatZeut)) {
        showThanksScreen(false);
    } else showFreezedAccounts();
} // DONE

function showThanksScreen(freezedAccounts: boolean) {
    const elements = [];

    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);
    elements.push(logo);
    elements.push(marketingText);

    if (freezedAccounts) {
        const thanksText = new Text('Thanks!',
            {
                fill: 0x0, align: 'center', fontSize: 35
            });

        thanksText.x = 200;
        thanksText.y = 160;
        elements.push(thanksText);
    } else {
        const thanksText = new Text('Thanks!\nYou have not freezed accounts.\nCongratulations!',
            {
                fill: 0x0, align: 'center',
            });

        thanksText.x = 60;
        thanksText.y = 120;
        elements.push(thanksText);
    }

    const reklamePropose = new Text('Do you want to take insurance?', {fontSize: 30});
    reklamePropose.x = 65;
    reklamePropose.y = 350;
    elements.push(reklamePropose);

    const acceptButton = new Button({
        label: 'Accept',
        x: 135,
        y: 450
    });
    acceptButton.interactive = true;
    acceptButton.on('pointerup', () => {
        showInsuranceScreen();
    })

    const declineButton = new Button({
        label: 'Decline',
        x: 370,
        y: 450
    })
    declineButton.interactive = true;
    declineButton.on('pointerup', () => {
        showStartScreen();
    })
    elements.push(acceptButton, declineButton);

    factory.showScreen('thanksScreen', elements)
} // DONE

function showFreezedAccounts() {
    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const freezedAccountsFound = new Text(`We found ${freezedAccountsCount[enteredTeudatZeut]} freezed accounts\non teudat zeut №${enteredTeudatZeut}`,
        {
            fill: 0x0, align: 'center', fontSize: 31
        });
    freezedAccountsFound.x = 36;
    freezedAccountsFound.y = 127;

    const payMoneyText = new Text('You can pay 10 shekels for\ncheck the freezes accounts', {
        fill: 0x0,
        align: 'center'
    });
    payMoneyText.x = 100;
    payMoneyText.y = 320;

    const acceptButton = new Button({
        label: 'Accept',
        x: 135,
        y: 450
    });
    acceptButton.interactive = true;
    acceptButton.on('pointerup', () => {
        showPayScreen();
    })

    const declineButton = new Button({
        label: 'Decline',
        x: 370,
        y: 450
    })
    declineButton.interactive = true;
    declineButton.on('pointerup', () => {
        showThanksScreen(true);
    })

    factory.showScreen('freezedAccounts', [logo, marketingText, freezedAccountsFound, payMoneyText, acceptButton, declineButton])
} // DONE

function showPayScreen() {
    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const putMoney = new Text('Please,\nput your money inside acceptor', {align: 'center'})
    putMoney.x = 80;
    putMoney.y = 200;

    // todo add money acceptor from pr bank
    let puttedMoney = 0;
    const puttedCountText = new Text(`Already you put: ${puttedMoney} shekels`, {align: 'center'})
    puttedCountText.x = 80;
    puttedCountText.y = 450;

    setTimeout(() => {
        puttedMoney += 2;
        puttedCountText.text = `Already you put: ${puttedMoney} shekels`;
    }, 2100)
    setTimeout(() => {
        puttedMoney += 5;
        puttedCountText.text = `Already you put: ${puttedMoney} shekels`;
    }, 4400)
    setTimeout(() => {
        puttedMoney += 2;
        puttedCountText.text = `Already you put: ${puttedMoney} shekels`;
    }, 6600)
    const lastSetTimeout = setTimeout(() => {
        puttedMoney += 1;
        puttedCountText.text = `Already you put: ${puttedMoney} shekels`;
        showListOfFreezedAccounts();
    }, 7500)

    const payCardButton = new Button({
        label: 'Pay by card ->'
    })
    payCardButton.interactive = true;
    payCardButton.x = 250;
    payCardButton.y = 370;
    payCardButton.on('pointerup', () => {
        clearTimeout(lastSetTimeout);
        payCardScreen();
    })

    factory.showScreen('payCash', [logo, marketingText, putMoney, puttedCountText, payCardButton]);
} // DONE

function payCardScreen() {
    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const payCardText = new Text('Please,\nput your card on NFC Reader', {align: 'center'})
    payCardText.x = 80;
    payCardText.y = 140;

    const cardTexture = loader.resources.card.texture as Texture<Resource>;
    const card = new Sprite(cardTexture);
    card.scale.x = 0.6
    card.scale.y = 0.6
    card.x = 80;
    card.y = 240;

    card.alpha = 0;
    ease.add(card, {alpha: 1}, {duration: 1000})

    setTimeout(() => {
        bar.showProgressLine(showListOfFreezedAccounts);
    }, 4000)

    setTimeout(() => {
        ease.add(card, {alpha: 0}, {duration: 1000})
    }, 4000)

    factory.showScreen('payCard', [logo, marketingText, payCardText, card, bar]);
} // DONE

function showListOfFreezedAccounts() {
    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const text = new Text(freezedAccountsInfo[enteredTeudatZeut], {fontSize: 20});
    text.x = 10;
    text.y = (SIZE - text.height) / 2;

    const finishButton = new Button({
        label: 'Finish'
    })
    finishButton.interactive = true;
    finishButton.x = 400;
    finishButton.y = 450;
    finishButton.on('pointerup', () => {
        showThanksScreen(true);
    })

    factory.showScreen('listOfFreezedAccounts', [logo, marketingText, text, finishButton]);
} // DONE

function showInsuranceScreen() {
    const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const logoTextInsurance = new Text('Our insurance packages', { fontSize: 35 });
    logoTextInsurance.x = 50;
    logoTextInsurance.y = 125;

    const firstInsurance = new Text('Ariel. Just for you. Simple package', { fontSize: 20 });
    firstInsurance.interactive = true;
    firstInsurance.x = 20;
    firstInsurance.y = 200;
    firstInsurance.on('pointerup', firstInsuranceHandler);

    const secondInsurance = new Text('Menora. For you and your family. Normal package', { fontSize: 20 });
    secondInsurance.interactive = true;
    secondInsurance.x = 20;
    secondInsurance.y = 250;
    secondInsurance.on('pointerup', secondInsuranceHandler);

    const thirdInsurance = new Text('AIG. For you family. Package plus', { fontSize: 20 });
    thirdInsurance.interactive = true;
    thirdInsurance.x = 20;
    thirdInsurance.y = 300;
    thirdInsurance.on('pointerup', thirdInsuranceHandler);

    const fourthInsurance = new Text('Fenix. For you and your family. Huge insurance', { fontSize: 20 });
    fourthInsurance.interactive = true;
    fourthInsurance.x = 20;
    fourthInsurance.y = 350;
    fourthInsurance.on('pointerup', fourthInsuranceHandler);

    const selectOneText = new Text('Select one, which interest you', { fontSize: 30, fill: 0xffffff });
    selectOneText.x = 50;
    selectOneText.y = 430;

    factory.showScreen('InsuranceScreen', [logo, marketingText, selectOneText, logoTextInsurance, firstInsurance, secondInsurance, thirdInsurance, fourthInsurance]);
}

function firstInsuranceHandler () {
        const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const polotnoText = new Text(`
    Ariel  is one of Israel's five largest insurance & 
    finance groups. The group specializes in asset management. 
    It is mostly known for managing the largest pension fund 
    in Israel - ‘Menora Mivtachim Pension'. The group is 
    also the largest General Insurer in Israel and the 
    market leader in the Motor Insurance sector.`, { fontSize: 17 })
    polotnoText.x = 5;
    polotnoText.y = (SIZE - polotnoText.height) / 2;

    const phoneText = new Text('Our phone: +972 3-744-5441\nCall us to register insurance', { fill: 0xffffff, fontSize: 20 })
    phoneText.x = 20;
    phoneText.y = 450;

    const finishButton = new Button({
        label: 'Finish'
    })
    finishButton.interactive = true;
    finishButton.x = 400;
    finishButton.y = 450;
    finishButton.on('pointerup', () => {
        showStartScreen();
    })

    factory.showScreen('firstInsuranceHandler', [logo, marketingText, phoneText, polotnoText, finishButton])
}

function secondInsuranceHandler () {
        const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const polotnoText = new Text(`
    Menora Mivtachim Holdings Ltd. is one of Israel's five largest 
    insurance & finance groups. The group specializes in asset 
    management. It is mostly known for managing the largest
    fund in Israel - ‘Menora Mivtachim Pension'. The group is also 
    the largest General Insurer in Israel and the market leader in 
    the Motor Insurance sector.

    The group operates through its subsidiaries, in all sectors of Life 
    Insurance, Long/Mid/Short -Term Savings, General Insurance  
    Health Insurance. In addition, the group is active in the capital 
    markets and finance sectors, including Mutual Funds, 
    Financial Portfolio Management, Underwriting, and worldwide 
    estate investments.`, { fontSize: 17 })
    polotnoText.x = 3;
    polotnoText.y = (SIZE - polotnoText.height) / 2;

    const phoneText = new Text('Our phone: +972 3-744-5441\nCall us to register insurance', { fill: 0xffffff, fontSize: 20 })
    phoneText.x = 20;
    phoneText.y = 450;

    const finishButton = new Button({
        label: 'Finish'
    })
    finishButton.interactive = true;
    finishButton.x = 400;
    finishButton.y = 450;
    finishButton.on('pointerup', () => {
        showStartScreen();
    })

    factory.showScreen('secondInsuranceHandler', [logo, marketingText, phoneText, polotnoText, finishButton])
}

function thirdInsuranceHandler () {
        const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const polotnoText = new Text(`
    AIG. is a private company, fully owned by 
    Harel Insurance Investments and Financial 
    Services Ltd. (Harel Group) - one of Israel's 
    largest public companies, whose shares are 
    traded on the Tel Aviv Stock Exchange. 
    AIG is the third largest insurance group in 
    Israel. It is the second largest in general 
    insurance; the market leader in health insurance, 
    and from the perspective of premium volume, it is 
    the third largest in life insurance. 
    AIG contains almost all the insurance activity 
    that Harel Insurance Investments & Financial Services 
    has acquired over time: Harel, which was established 
    by the Group in 1975, Shiloah (acquired in 1984), 
    the Yardeniya portfolio (1985), Sahar (1989), 
    and Zion (1999).`, { fontSize: 17 })
    polotnoText.x = 5;
    polotnoText.y = (SIZE - polotnoText.height) / 2;

    const phoneText = new Text('Our phone: +972 3-744-5441\nCall us to register insurance', { fill: 0xffffff, fontSize: 20 })
    phoneText.x = 20;
    phoneText.y = 450;

    const finishButton = new Button({
        label: 'Finish'
    })
    finishButton.interactive = true;
    finishButton.x = 400;
    finishButton.y = 450;
    finishButton.on('pointerup', () => {
        showStartScreen();
    })

    factory.showScreen('thirdInsuranceHandler', [logo, marketingText, phoneText, polotnoText, finishButton])
}

function fourthInsuranceHandler () {
        const logoTexture = loader.resources.logo.texture as Texture<Resource>;
    const logo = new Sprite(logoTexture);

    const polotnoText = new Text(`
    71 years of experience and counting…
    The Phoenix has been operating in the 
    Insurance and Finance field for the 
    past 71 years, and as of today, is 
    considered to be the leading insurance 
    company in Israel. The Company's main 
    focus is in the insurance, health, 
    pension and provident fields.`, { fontSize: 23 })

    polotnoText.x = 20;
    polotnoText.y = (SIZE - polotnoText.height) / 2;

    const phoneText = new Text('Our phone: +972 3-744-5441\nCall us to register insurance', { fill: 0xffffff, fontSize: 20 })
    phoneText.x = 20;
    phoneText.y = 450;

    const finishButton = new Button({
        label: 'Finish'
    })
    finishButton.interactive = true;
    finishButton.x = 400;
    finishButton.y = 450;
    finishButton.on('pointerup', () => {
        showStartScreen();
    })

    factory.showScreen('fourthInsuranceHandler', [logo, marketingText, phoneText, polotnoText, finishButton])
}

