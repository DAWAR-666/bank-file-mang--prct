const bankData='bank_data.csv'
const fs=require('fs').promises;
async function getData() {
    
    let data=await fs.readFile(bankData, 'utf8');
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
            if(element.Remarks.toLowerCase().includes("salary")){
                sum_list[element.AccountHolder].SalaryTransactions.push(element.TransactionID);
            }
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
                    LargestTransaction:element.Amount,
                    SalaryTransactions:[]
                };
                if(element.Remarks.toLowerCase().includes("salary")){
                    sum_list[element.AccountHolder].SalaryTransactions.push(element.TransactionID);
                }
                            
            }
            else if(element.Type==='Debit'){
                sum_list[element.AccountHolder]={
                    TotalCredit:0,
                    TotalDebit:element.Amount,
                    LargestTransaction:element.Amount,
                    SalaryTransactions:[]
                };
                if(element.Remarks.toLowerCase().includes("salary")){
                    sum_list[element.AccountHolder].SalaryTransactions.push(element.TransactionID);
                }
                
            
            }
            
        }
        
    })
    return sum_list;
}
async function converter() {
    let sum_list=await summary()
    let sum_arr=[]
    Object.keys(sum_list).forEach((element)=>{
        let obj={
            AccountHolder:element,
            TotalCredit:sum_list[element].TotalCredit,
            TotalDebit:sum_list[element].TotalDebit,
            LargestTransaction:sum_list[element].LargestTransaction,
            SalaryTransactions:sum_list[element].SalaryTransactions.join(';')
        }
        sum_arr.push(obj);
    })
    return sum_arr;
}
async function fileWrite() {
    const sum_arr=await converter();        
    const headers= [
            'AccountHolder',
            'TotalCredit',
            'TotalDebit',
            'LargestTransaction',
            'SalaryTransactions'
        ]
    const headerRow = headers.join(',');

    const dataRows = sum_arr.map(record => {
        return headers.map(header => record[header]).join(',');
    });

    const csvContent = [headerRow, ...dataRows].join('\n');

    fs.writeFile("./bank_summary.csv", csvContent);
}
fileWrite()