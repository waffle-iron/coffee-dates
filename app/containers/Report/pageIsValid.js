export default (pageNo, page, report) => {
  let isValid = true;
  page.fields.forEach(f => {
    if (!report[pageNo][f.brief]) isValid = false;
  });
  return isValid;
};
