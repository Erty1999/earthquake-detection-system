import passport from "passport";
import { Strategy } from "passport-local";
import { AppDataSource } from "../dataSource";
import { User } from "../model/user";
import { pbkdf2, timingSafeEqual } from "crypto";

passport.use(
  new Strategy(async function verify(username, password, cb) {
    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", { email: username })
      .getOne();

    if (!user) {
      return cb(null, false, { message: "Incorrect username or password." });
    }

    pbkdf2(
      password,
      "salt",
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        if (!timingSafeEqual(user.password as any, hashedPassword)) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        return cb(null, user);
      }
    );
  })
);
