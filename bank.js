const bankData='https://gist.githubusercontent.com/yash2324/60db76164a7bf5e8e6426c89bd84f265/raw/4f0728dd61f577bbc65ce2c3c6c8466429a77c3d/fe02_bank.csv'
async function getData() {
    let file=await fetch(bankData)
    let data=await file.text();
    return data;
}
async function parsing(params) {
    const data=await getData();
    let dataArr=(await data).split('\n');
    let arr=[];
    for(let i=1;i<dataArr.length;i++){
        let temp=dataArr[i].split(',');
        let obj={
            TransactionID:temp[0].trim(),
            Date:temp[1].trim(),
            AccountHolder:temp[2].trim(),
            Type:temp[3].trim(),
            Amount:parseFloat(temp[4].trim()),
            Remarks:temp[5].trim()
        }
        arr.push(obj);
    }
    return arr;
}
async function sorting() {
    let arr=await parsing();
    arr.sort((a,b)=>new Date(a.Date)-new Date(b.Date))  
    return arr; 
}
async function summary() {
    let arr=await sorting();
    let sum_list={}
    arr.forEach((element)=>{
        if(element.AccountHolder in sum_list){
            sum_list[element.AccountHolder].LargestTransaction=sum_list[element.AccountHolder].LargestTransaction<element.Amount ? element.Amount : sum_list[element.AccountHolder].LargestTransaction;
            if(element.Type==='Credit'){
                sum_list[element.AccountHolder].TotalCredit+=element.Amount;
            }
            else if(element.Type==='Debit'){
                sum_list[element.AccountHolder].TotalDebit+=element.Amount;
            }
        }
        else{
            if(element.Type==='Credit'){
                sum_list[element.AccountHolder]={
                    TotalCredit:element.Amount,
                    TotalDebit:0,
                    LargestTransaction:0,
                    SalaryTransactions:[]
                };
            }
            else if(element.Type==='Debit'){
                sum_list[element.AccountHolder]={
                    TotalCredit:0,
                    TotalDebit:element.Amount,
                    LargestTransaction:0,
                    SalaryTransactions:[]
                };
            }
            
        }
    })
    console.log(sum_list)
    console.log(Object.keys(sum_list))
}