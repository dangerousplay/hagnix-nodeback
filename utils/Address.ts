const feign = require('feignjs');
const feignRequest = require('feignjs-request');

export interface CEP {
    cep:String,
    logradouro:String,
    complemento:String,
    bairro:String,
    localidade:String,
    uf:String,
    unidade:String,
    ibge:String,
    gia:String
}

const apiCEP = {
    getCEP: 'GET ws/{id}/json/'
};

const client = feign.builder()
    .client(new feignRequest())
    .target(apiCEP, 'https://viacep.com.br');


export function getCEP(cep: String) : Promise<CEP> {
    return client.getCEP(cep);
}
