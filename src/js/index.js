export default () => {
	
const priceInNanoElement = document.querySelector('input[name="nano_price"]');
const priceInVesElement = document.querySelector('input[name="ves_price"]');
const priceInUsdElement = document.querySelector('input[name="usd_price"]');

const Nano = 'NANO';
const Ves = 'VES';
const Usd = 'USD';

let nanoToUsdPrice = 0;
let vesToUsdPrice = 0;

priceInNanoElement.addEventListener('input', e => updateValue(Nano, e.target.value));
priceInVesElement.addEventListener('input', e => updateValue(Ves, e.target.value));
priceInUsdElement.addEventListener('input', e => updateValue(Usd, e.target.value));

priceInNanoElement.addEventListener('blur', e => resetValues(e));
priceInVesElement.addEventListener('blur', e => resetValues(e));
priceInUsdElement.addEventListener('blur', e => resetValues(e));

const getNanoPrice = async newValue => {
	const url = 'https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd';
	try{
		const res = await fetch(url);
		const data = await res.json();
		nanoToUsdPrice = data.nano.usd;
		priceInNanoElement.value = 1;
		updateValue(Nano, priceInNanoElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}
const getVesPrice = async newValue => {
	const url = 'https://s3.amazonaws.com/dolartoday/data.json';
	try{
		const res = await fetch(url);
		const data = await res.json();
		vesToUsdPrice = data.USD.dolartoday;
		priceInNanoElement.value = 1;
		updateValue(Nano, priceInNanoElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}

const updateValue = (currency, value) => {

	const parsedValue = value === '' ? 1 : parseFloat(value);

	if(currency === Nano){
		const newVesValue = (parsedValue * nanoToUsdPrice * vesToUsdPrice).toFixed(2);
		priceInVesElement.value = newVesValue;
		priceInUsdElement.value = (parsedValue * nanoToUsdPrice).toFixed(2);
	} else if(currency === Ves){
		const newNanoValue = (parsedValue / (nanoToUsdPrice * vesToUsdPrice)).toFixed(2);
		priceInNanoElement.value = newNanoValue;
		priceInUsdElement.value = (parsedValue / vesToUsdPrice).toFixed(2);
	} else if(currency === Usd){
		 priceInNanoElement.value = (parsedValue / nanoToUsdPrice).toFixed(2);
		 priceInVesElement.value = (parsedValue * vesToUsdPrice).toFixed(2);
	}
}
const resetValues = e => {
	if (e.target.value === '' || parseFloat(e.target.value) === 0) {
		priceInNanoElement.value = 1;
		updateValue(Nano, 1);
	};
}

const checkData = () => {
	if (nanoToUsdPrice !== 0 && vesToUsdPrice !== 0) {
		setTimeout(() => {
			document.querySelector('.card').classList.toggle('animation');
			document.querySelector('.card .card__loader').classList.toggle('card__loader--loading');
			setTimeout(() => {
				document.querySelector('.card .card__loader').style.display = 'none';
			}, 500);
		}, 500);
	}
}

getNanoPrice();
getVesPrice();
}