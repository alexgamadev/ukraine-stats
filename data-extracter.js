import { parse } from 'date-fns'

function extractDailyData(textContent) {
    const date = extractDate(textContent);
    const losses = extractPersonnelLosses(textContent);

    return {
        date,
        losses
    }
}

function extractPersonnelLosses(textContent) {
    let searchRegex = /personnel\s?(‒|-)\s?about\s?\d+/;
    let personnelText = textContent.match(searchRegex);

    if( !personnelText ) return null;

    let losses = personnelText[0].match(/[0-9]+/g);
    if( !losses ) return null;
    
    return losses[0]; 
}

function extractDate(textContent) {
    const searchRegex = /(\d+\.\d+)/g;
    let datesText = textContent.match(searchRegex);
    if( !datesText ) return null;
    console.log(datesText);
    return parse(datesText[1], 'dd.MM', new Date());
}

export default extractDailyData;