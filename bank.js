const bankData='https://gist.githubusercontent.com/yash2324/60db76164a7bf5e8e6426c89bd84f265/raw/4f0728dd61f577bbc65ce2c3c6c8466429a77c3d/fe02_bank.csv'
async function getData() {
    let file=await fetch(bankData)
    let data=file.text()
    return data;
}
async function parsing(params) {
    
}