var sampleData = {
	apps: [
    { id: 1, title: 'Lorem', published: true, userId: 123 },
    { id: 2, title: 'Ipsum', published: false, userId: 123 },
    { id: 3, title: 'Dolor', published: true, userId: 456 },
    { id: 4, title: 'Sit', published: true, userId: 789 },
    { id: 5, title: 'Amet', published: false, userId: 123 },
    { id: 6, title: 'Et', published: true, userId: 123 }
  ],
  organizations: [
  	{ id: 1, name: 'Google', suspended: true, userId: 123 },
    { id: 2, name: 'Apple', suspended: false, userId: 456 },
    { id: 3, name: 'Fliplet', suspended: false, userId: 123 }
  ]
}

// @TODO: This is the model/class you should work out
class User {
    constructor(id) {
  	    this.id = id
    }
  
    select(table) {
        if (table in sampleData) {
            this.table = table;
            return this;
        } else {
            throw {msg: "table doesn't exist"};
        }
    }
  
    attributes(columns) {
        this.columns = columns;
        return this;
    }
  
    where(condition) {
        this.condition = condition;
        return this;
    }
  
    order(orderBy) {
        this.orderByColumns = orderBy;
        return this;
    }
  
    sortData(data) {
        this.orderByColumns.forEach(column => {
            let columnType = typeof(sampleData[this.table][0][column]);

            if (columnType == "number" || columnType == "boolean") {
                data = data.sort((a, b) => a[column] - b[column]);
            } else if (columnType == "string") {
                data = data.sort((a, b) => {
                    if (a[column] < b[column]) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }
        })
        
        return data;
    }
    
    findOne() {
        let data;

        data = sampleData[this.table]
            .filter(el => {
                let satisfiedConditionsCount = 0;
                let columns = Object.keys(this.condition);

                columns.forEach(column => {
                    if (this.condition[column] == el[column]) {
                        satisfiedConditionsCount += 1;
                    }
                })

                if (satisfiedConditionsCount == columns.length) {
                    return true;
                } else {
                    return false;
                }
            });

        if (this.orderByColumns) {
            data = this.sortData(data);
        }

        data = data.map(el => {
            var row = {};

            this.columns.forEach(column => {
                if (column in el) {
                    row[column] = el[column];
                }
            })

            return row;
        })
        
        return Promise.resolve(data[0]);
    }
    
    findAll() {
        let data;

        data = sampleData[this.table]
            .filter(el => {
                let satisfiedConditionsCount = 0;
                let columns = Object.keys(this.condition);

                columns.forEach(column => {
                    if (this.condition[column] == el[column]) {
                        satisfiedConditionsCount += 1;
                    }
                })

                if (satisfiedConditionsCount == columns.length) {
                    return true;
                } else {
                    return false;
                }
            });

        if (this.orderByColumns) {
            data = this.sortData(data);
        }

        data = data.map(el => {
            var row = {};

            this.columns.forEach(column => {
                if (column in el) {
                    row[column] = el[column];
                }
            })

            return row;
        })
        
        return Promise.resolve(data);
    }
}

// ------------------------------------------
// You shouldn't need to edit below this line

var user = new User({
	id: 123
});

// Mimic what a ORM-like query engine would do by filtering the
// "sampleData" based on the query and the expected result example.
// Hint: lodash can be quite handly in dealing with this.
user
    .select('apps')
    .attributes(['id', 'title'])
    .where({ published: true })
    .order(['title'])
    .findAll()
    .then(function (apps) {
        // The expected result is for the "apps" array is:
        // [ { id: 6, title: 'Et' }, { id: 1, title: 'Lorem' } ]
        console.log(apps);
    })
  
user
    .select('organizations')
    .attributes(['name'])
    .where({ suspended: false })
    .findOne()
    .then(function (organization) {
        // The expected result is for the "organization" object is:
        // { id: 3, name: 'Fliplet' }
        console.log(organization);
    })
  
