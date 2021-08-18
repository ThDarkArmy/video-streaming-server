const isPalindrome = (str1)=>{
    for(var i=0;i<str1.length/2; i++){
        if(str1[i]!==str1[str1.length-1]){
            return false;
        }
        return true
    }
}

const findLongestPalindrome = (str1)=>{
    let p1 = ""
    let l1 = 0;
    for(var i=1;i<=str1.length; i++){

        if(isPalindrome(str1.substring(0, i)) && str1.substring(0,i).length>=l1){
            l1 = str1.substring(0,i).length
            p1 = str1.substring(0,i)
            // console.log(p1, l1)
        }
    }

    let p2 = ""
    let l2 = 0;
    for(var i=0;i<=str1.length; i++){
        if(isPalindrome(str1.substring(i, str1.length)) && str1.substring(i, str1.length).length>=l2){
            // console.log(str1.substring(i,str1.length))
            l2 = str1.substring(i, str1.length).length
            p2 = str1.substring(i, str1.length)
        }
    }

    // console.log(p1, p2)
    if(p2.length>p1.length){
        return p2;
    }else{
        return p1;
    }
}

// console.log(isPalindrome("EKE"))

const pl = findLongestPalindrome("EKE")

console.log(pl)
