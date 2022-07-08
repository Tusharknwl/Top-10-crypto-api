const PORT = process.env.PORT || 8000
const express = require('express')
const cheerio = require('cheerio')
const { default: axios } = require('axios')

const app = express()

const coinArr = []

app.get('/', (req, res) => {
    res.json('Welcome To My Crypto Price Feed API')
})

app.get('/api/price-feed', (req, res) => {
    axios.get('https://coinmarketcap.com/')
    .then((response) =>{
        const html = response.data
        const $ = cheerio.load(html)

        const elemSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr'


        const keys = [
            'rank',
            'name',
            'price', 
            '1h',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'

        ]


        $(elemSelector).each((parentIdx, parentElem) => {
            let keyIdx =0
            const coinObj = {}
            if(parentIdx<=9) {
                $(parentElem).children().each((childIdx, childElem) =>{
                    let tdValue = $(childElem).text()

                    if(keyIdx===1 || keyIdx ===6) {
                        
                            tdValue = $('p:first-child',$(childElem).html()).text()
                            
                    }

                    if(tdValue) {
                        coinObj[keys[keyIdx]] = tdValue
                        keyIdx++;
                    }
                })
                coinArr.push(coinObj)
            }
            
        })
        res.json(coinArr)
    }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
