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
 * Calculates the annual rate (TAE) based on initialized values.
 *
 * @param {number} loanLengthYears - The length of the loan in years.
 * @param {number} rawPrice - The initial loan amount.
 * @param {number} vehicleDeposit - The initial deposit amount.
 * @param {number} annualRateTIN - The annual interest rate as a decimal (e.g., 0.0986 for 9.86%).
 * @param {number} initialFeePercentage - The initial fee percentage as a decimal (e.g., 0.025 for 2.5%).
 * @param {number} additionalMonthlyRepaymentFeeAmount - The additional monthly repayment fee amount.
 * @return {object} An object containing calculated results.
 */
function calculateRate(loanLengthYears, rawPrice, vehicleDeposit, annualRateTIN, initialFeePercentage, additionalMonthlyRepaymentFeeAmount) {
    const loanLengthMonths = loanLengthYears * 12;
    const totalLoanAmount = rawPrice - vehicleDeposit;
    const initialFeeAmount = totalLoanAmount * initialFeePercentage;
    const additionalMonthlyRepaymentFeeTotal = loanLengthMonths * additionalMonthlyRepaymentFeeAmount;
    const ratePerMonth = annualRateTIN / 12;
    const nper = loanLengthMonths;
    const pv = totalLoanAmount;
    const adjustedPv = pv - initialFeeAmount - additionalMonthlyRepaymentFeeTotal;

    const pmt = PMT(ratePerMonth, nper, pv);
    const monthlyRateTIN = RATE(nper, pmt, adjustedPv, 0, 0, ratePerMonth);
    const annualRateTAE = Math.pow(1 + monthlyRateTIN, 12) - 1;
    const monthlyAdditionalCosts = (initialFeeAmount + additionalMonthlyRepaymentFeeTotal) / loanLengthMonths;
    const monthlyPaymentWithCosts = pmt - monthlyAdditionalCosts;

    return {
        annualRateTAE: (annualRateTAE * 100).toFixed(2),
        totalLoanAmount: totalLoanAmount.toFixed(2),
        initialFeeAmount: initialFeeAmount.toFixed(2),
        additionalMonthlyRepaymentFeeTotal: additionalMonthlyRepaymentFeeTotal.toFixed(2),
        pmt: pmt,
        formatedPmt: formatCurrency(Math.abs(pmt)),
        monthlyRateTIN: (monthlyRateTIN * 100).toFixed(2),
        monthlyPaymentWithCosts: monthlyPaymentWithCosts.toFixed(2)
    };
}

/**
 * Sets the annual interest rate (TIN) and loan term based on vehicle rawPrice, year, and rawKilometres.
 *
 * @param {number} year - The year of the vehicle.
 * @param {number} rawKilometres - The rawKilometres of the vehicle.
 * @param {number} rawPrice - The rawPrice of the vehicle.
 * @return {object} An object containing annualRateTIN, loanLengthMonths, and commissionRate.
 */
function setLoanParameters(year, rawKilometres, rawPrice) {
    let annualRateTIN;
    let loanLengthMonths;
    let commissionRate;
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const isHighKilometres = rawKilometres > 90000;
    const isOldVehicle = age > 5;

    if (rawPrice < 10000) {
        annualRateTIN = 12.5;
        loanLengthMonths = 72; // Adjusted based on shorter term for lower-rawPriced, older vehicles
        commissionRate = 4.25; // High commission for higher interest rate
    } else if (rawPrice < 20000) {
        if (isOldVehicle || isHighKilometres) {
            annualRateTIN = 7.75;
            loanLengthMonths = 72;
            commissionRate = 4.25; // High commission for higher interest rate
        } else {
            annualRateTIN = 7.5;
            loanLengthMonths = 120;
            commissionRate = 3.95; // Lower commission for lower interest rate
        }
    } else {
        if (isOldVehicle || isHighKilometres) {
            annualRateTIN = 9.86; // Adjusted value
            loanLengthMonths = 96;
            commissionRate = 2.5; // High commission for higher interest rate
        } else if (age > 5) {
            annualRateTIN = 7.5;
            loanLengthMonths = 108;
            commissionRate = 3.95; // Lower commission for lower interest rate
        } else {
            annualRateTIN = 7.5;
            loanLengthMonths = 120;
            commissionRate = 3.95; // Lower commission for lower interest rate
        }
    }

    return { annualRateTIN, loanLengthMonths, commissionRate };
}


// Export functions
export { 
    calculateRate, 
    setLoanParameters 
};