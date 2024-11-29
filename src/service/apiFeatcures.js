export class APiFEATURES {
  constructor(mongooesQuery, queryString) {
    this.mongooesQuery = mongooesQuery;
    this.queryString = queryString;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    if (page < 1) page = 1;
    let limit = 5;
    let skip = (page - 1) * limit;
    this.mongooesQuery.find().skip(skip).limit(limit);
    return this;
  }

  filter() {
    let filterQuery = { ...this.queryString };
    let excludeArray = ["sort", "page", "search", "select"];
    excludeArray.forEach((ele) => {
      delete filterQuery[ele];
    });
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(
        /gt|lt|eq|gte|lte/,
        (ele) => `$${ele}`
      )
    );
    this.mongooesQuery.find(filterQuery);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.mongooesQuery.sort(this.queryString.sort.replaceAll(",", " "));
    }
    return this;
  }
  select() {
    if (this.queryString.select) {
      this.mongooesQuery.select(this.queryString.select.replaceAll(",", " "));
      // console.log(req.query.sort.replaceAll(","," "))
    }
    return this;
  }
}
