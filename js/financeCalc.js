// financeCalc.js

import { formatCurrency } from './formatCarData.js';

/**
 * Calculates the payment for a loan based on constant payments and a constant interest rate.
 *
 * @param {number} rate - The monthly interest rate.
 * @param {number} nper - The total number of months.
 * @param {number} pv - The present value (loan amount minus initial deposit and fees).
 * @param {number} [fv=0] - The future value (default is 0).
 * @param {number} [type=0] - When payments are due: 0 = end of period, 1 = beginning of period (default is 0).
 * @return {number} The monthly payment.
 */
function PMT(rate, nper, pv, fv = 0, type = 0) {
    if (rate === 0) {
        return -(pv + fv) / nper;
    }

    const pvif = Math.pow(1 + rate, nper);
    let pmt = rate * pv * pvif / (pvif - 1);

    if (type === 1) {
        pmt /= (1 + rate);
    }

    return -pmt;
}

/**
 * Calculates the monthly interest rate.
 *
 * @param {number} nper - The total number of months.
 * @param {number} pmt - The monthly payment.
 * @param {number} pv - The present value (loan amount minus initial deposit and fees).
 * @param {number} [fv=0] - The future value (default is 0).
 * @param {number} [type=0] - When payments are due: 0 = end of period, 1 = beginning of period (default is 0).
 * @param {number} [guess=0.1] - Your guess for what the rate will be (default is 0.1 or 10%).
 * @return {number} The monthly interest rate.
 */
function RATE(nper, pmt, pv, fv = 0, type = 0, guess = 0.1) {
    const eps = 1e-10; // Tolerance for convergence
    const maxIter = 100; // Maximum iterations for convergence
    let rate = guess;

    for (let i = 0; i < maxIter; i++) {
        const pvif = Math.pow(1 + rate, nper);
        const y = pv * pvif + pmt * (1 + rate * type) * (pvif - 1) / rate + fv;
        const yprime = pv * nper * Math.pow(1 + rate, nper - 1) + pmt * (1 + rate * type) * ((pvif - 1) / rate + nper * Math.pow(1 + rate, nper - 1) / rate - (pvif - 1) / (rate * rate));
        const newRate = rate - y / yprime;

        if (Math.abs(newRate - rate) < eps) {
            return newRate;
        }

        rate = newRate;
    }

    return rate;
}

/**
 * Calculates the annual rate (TAE) based on loan and vehicle parameters.
 *
 * @param {number} rawFinancePrice - The total price of the vehicle.
 * @param {number} deposit - The deposit amount (down payment).
 * @param {number} initialFeePercent - The initial fee percentage as a decimal.
 * @param {number} loanTermMonths - The length of the loan in months.
 * @param {number} additionalRepaymentFee - The additional monthly repayment fee amount.
 * @param {number} annualRateTIN - The annual nominal interest rate (TIN) as a decimal.
 * @return {object} An object containing calculated results such as annualRateTIN, annualRateTAE, and monthly payment.
 */
function calculateRate(rawFinancePrice, deposit, initialFeePercent, loanTermMonths, additionalRepaymentFee, annualRateTIN) {
    const totalLoanAmount = rawFinancePrice - deposit;
    const initialFeeAmount = totalLoanAmount * initialFeePercent;
    const additionalMonthlyRepaymentFeeTotal = loanTermMonths * additionalRepaymentFee;
    
    const ratePerMonth = annualRateTIN / 12;
    const adjustedPv = totalLoanAmount - initialFeeAmount - additionalMonthlyRepaymentFeeTotal;

    const pmt = PMT(ratePerMonth, loanTermMonths, totalLoanAmount);
    const monthlyRateTIN = RATE(loanTermMonths, pmt, adjustedPv, 0, 0, ratePerMonth);
    const annualRateTAE = Math.pow(1 + monthlyRateTIN, 12) - 1;

    const monthlyPaymentWithCosts = pmt - (initialFeeAmount + additionalMonthlyRepaymentFeeTotal) / loanTermMonths;

    return {
        annualRateTIN: (annualRateTIN * 100).toFixed(2),
        annualRateTAE: (annualRateTAE * 100).toFixed(2),
        totalLoanAmount: totalLoanAmount.toFixed(2),
        initialFeeAmount: initialFeeAmount.toFixed(2),
        additionalMonthlyRepaymentFeeTotal: additionalMonthlyRepaymentFeeTotal.toFixed(2),
        pmt,
        monthlyPaymentWithCosts: monthlyPaymentWithCosts.toFixed(2),
    };
}

/**
 * Sets the annual interest rate (TIN), loan term, and initial fee percentage based on vehicle value, year, and mileage.
 *
 * @param {number} year - The year of the vehicle.
 * @param {number} rawKilometres - The total kilometres of the vehicle.
 * @param {number} rawFinancePrice - The total price of the vehicle.
 * @return {object} An object containing the calculated annualRateTIN, loanTermMonths, and initialFeePercent.
 */
function setLoanParameters(year, rawKilometres, rawFinancePrice) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const isHighKilometres = rawKilometres > 90000;
    const isOldVehicle = age > 5;

    let annualRateTIN, loanTermMonths, initialFeePercent;

    if (rawFinancePrice < 10000) {
        annualRateTIN = 0.125;
        loanTermMonths = 72;
        initialFeePercent = 0.0425;
    } else if (rawFinancePrice < 20000) {
        annualRateTIN = 0.075;
        loanTermMonths = (isOldVehicle || isHighKilometres) ? 72 : 120;
        initialFeePercent = (isOldVehicle || isHighKilometres) ? 0.0425 : 0.0395;
    } else {
        annualRateTIN = (isOldVehicle || isHighKilometres) ? 0.0986 : (age > 5 ? 0.075 : 0.075);
        loanTermMonths = (isOldVehicle || isHighKilometres) ? 96 : (age > 5 ? 108 : 120);
        initialFeePercent = (isOldVehicle || isHighKilometres) ? 0.025 : (age > 5 ? 0.0295 : 0.0395);
    }

    return { initialFeePercent, loanTermMonths, annualRateTIN };
}

/**
 * Retrieves finance details for a car listing.
 * @param {number} year - The year of the vehicle.
 * @param {number} rawKilometres - The rawKilometres of the vehicle.
 * @param {number} rawFinancePrice - The price of the vehicle.
 * @returns {Object} details - An object containing all relevant finance details.
 */
function getFinanceDetails(year, rawKilometres, rawFinancePrice) {
    const { initialFeePercent, loanTermMonths, annualRateTIN } = setLoanParameters(year, rawKilometres, rawFinancePrice);

    const deposit = rawFinancePrice * 0.25; // Assuming 25% deposit
    const additionalRepaymentFee = 0.0; // Set to 0.0 as per original code

    // Calculate the finance rate using the provided function
    const result = calculateRate(
        rawFinancePrice,
        deposit,
        initialFeePercent,
        loanTermMonths,
        additionalRepaymentFee,
        annualRateTIN
    );

    // Return all necessary finance details, including formattedPmt at the top level
    return {
        initialFeePercent,
        loanTermMonths,
        deposit,
        additionalRepaymentFee,
        totalLoanAmount: result.totalLoanAmount,
        formattedPmt: formatCurrency(Math.abs(result.pmt)),
        annualRateTIN: result.annualRateTIN,
        annualRateTAE: result.annualRateTAE,
        installmentAmount: formatCurrency(Math.abs(result.pmt * loanTermMonths))
    };
}


// Export functions
export {
    calculateRate,
    getFinanceDetails
};
