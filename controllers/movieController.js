const { db, dbQuery, createToken } = require('../config')

module.exports = {
    getMovie: async (req, res, next) => {
        try {
            let getSQL, getMovie;
            dataSearch = []
            for (let prop in req.query) {
                dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`);
            }
            if (dataSearch.length > 0) {
                getSQL = `SELECT * FROM movies m JOIN schedules s on m.id = s.id WHERE ${dataSearch.join(" AND ")};`
                getMovie = `SELECT s.movie_id, s.location_id FROM schedules s INNER JOIN movies m on m.id = s.id;`
            } else {
                getSQL = `SELECT * FROM movies m JOIN schedules s on m.id = s.id`
                getMovie = `SELECT s.movie_id, s.location_id FROM schedules s INNER JOIN movies m on m.id = s.id;`
            }

            getSQL = await dbQuery(getSQL)
            getMovie = await dbQuery(getMovie)

            getSQL.forEach((item) => {
                item.movie_status = []
                getMovie.forEach((element) => {
                    if (item.id == element.id) {
                        item.movie_status.push(element)
                    }
                })
            })
            res.status(200).send({ status: "Success✅", results: getSQL });
        } catch (error) {
            next(error)
        }
    },
    addMovie: async (req, res, next) => {
        try {
            if (req.user.role == 1) {
                let queryMovie = `INSERT into movies set ?`
                queryMovie = await dbQuery(queryMovie, { ...req.body })

                let getMovie = await dbQuery(`Select * from movies where id=${queryMovie.insertId}`)
                let { id, name, release_date, release_month, release_year, genre, duration_min, description } = getMovie[0]

                // Membuat Token
                let token = createToken({ id, name, release_date, release_month, release_year, genre, duration_min, description })
                console.log("data token :", token)

                res.status(200).send({ id, name, release_date, release_month, release_year, genre, duration_min, description, token })
            } else {
                res.status(500).send('Your cannot Add Movies !!!')
            }
        } catch (error) {
            next(error)
        }
    },
    updateMovie: async (req, res, next) => {
        try {
            let queryUpdate = await dbQuery(`Update movies set status=2 where id=${db.escape(req.params.id)};`)
            res.status(200).send({ id: req.params.id, messages: "Status has been changed ✅" })
        } catch (error) {
            next(error)
        }
    },
    // updateJadwal: async (req, res, next) => {
    //     try {
    //         let queryUpdate = `INSERT into movies location_id`
    //     } catch (error) {
    //         next(error)
    //     }
    // }
}