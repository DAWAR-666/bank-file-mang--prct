const bankData='https://gist.githubusercontent.com/yash2324/60db76164a7bf5e8e6426c89bd84f265/raw/4f0728dd61f577bbc65ce2c3c6c8466429a77c3d/fe02_bank.csv'
async function getData() {
    let file=await fetch(bankData)
    let data=file.text();
    
    console.log(data);

    return data;
}
async function parsing(params) {
    const data=getData();
    let dataArr=(await data).split('\n');
    let arr=[];
    for(let i=1;i<dataArr.length;i++){
        let temp=dataArr[i].split(',');
        let obj={
            TransactionID:temp[0],
            Date:temp[1],
            AccountHolder:temp[2],
            Type:temp[3],
            Amount:temp[4],
            Remarks:temp[5]
        }
        arr.push(obj);
    }
    console.log(arr)
}