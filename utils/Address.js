"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feign = require('feignjs');
const feignRequest = require('feignjs-request');
const apiCEP = {
    getCEP: 'GET ws/{id}/json/'
};
const client = feign.builder()
    .client(new feignRequest())
    .target(apiCEP, 'https://viacep.com.br');
function getCEP(cep) {
    return client.getCEP(cep);
}
exports.getCEP = getCEP;
