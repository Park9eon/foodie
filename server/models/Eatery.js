const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const EaterySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    address: String, // 주소
    lng: Number, // 경도
    lat: Number, // 위도
  },
  tags: [String],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  reviews: [{
    userId: ObjectId,
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  }],
  photos: [String],
});

class EateryClass {
  static async search({ q = '*', size = 100 }) {
    const query = q.split('|');
    const sort = {};
    const recentIndex = query.indexOf('최근');
    if (recentIndex > -1) {
      sort.createAt = 1;
      query.splice(recentIndex, 1);
    }
    const recommendIndex = query.indexOf('추천');
    if (recommendIndex > -1) {
      sort.rating = -1;
      query.splice(recommendIndex, 1);
    }
    if (!(sort.createAt && sort.rating)) {
      sort.name = 1;
    }
    const regex = query.join('|');
    const results = await this.aggregate([
      {
        $match: {
          $or: [
            {
              name: {
                $regex: regex,
                $options: 'i',
              },
            },
            {
              description: {
                $regex: regex,
                $options: 'i',
              },
            },
            {
              tags: {
                $regex: regex,
                $options: 'i',
              },
            },
          ],
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          photos: 1,
          address: 1,
          tags: 1,
          rating: { $avg: '$reviews.rating' },
          reviews: 1,
        },
      },
      {
        $sort: sort,
      },
      {
        $limit: size,
      },
    ]);
    return results;
  }

  static async tags() {
    const results = await this.distinct('tags');
    return results;
  }

  static async list() {
    const results = await this.find({});
    return results;
  }

  static async getOne(id) {
    const result = await this.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $unwind: {
          path: '$reviews',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { a: '$reviews.userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$a'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                displayName: 1,
                avatarUrl: 1,
              },
            },
          ],
          as: 'reviews.user',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          photos: 1,
          address: 1,
          tags: 1,
          reviews: {
            rating: 1,
            review: 1,
            user: {
              $arrayElemAt: ['$reviews.user', 0],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          address: { $first: '$address' },
          photos: { $first: '$photos' },
          tags: { $first: '$tags' },
          reviews: { $push: '$reviews' },
        },
      },
    ]);
    return result[0];
  }

  static async add({
                     name,
                     address,
                     location,
                     photos,
                     tags,
                   }) {
    const result = await this.create({
      name,
      address,
      location,
      tags,
      photos,
    });
    return result;
  }

  static async addReview({
                           _id,
                           rating,
                           review,
                           user,
                         }) {
    const result = await this.updateOne({ _id }, {
      $push: {
        reviews: {
          userId: user._id,
          rating,
          review,
        },
      },
    });
    return result;
  }

  static async editReview({
                            _id,
                            reviewId,
                            rating,
                            review,
                          }) {
    const result = await this.updateOne({
      _id,
      'reviews._id': reviewId,
    }, {
      $set: {
        'reviews.$': {
          rating,
          review,
        },
      },
    });
    return result;
  }

  static async edit(id, {
    name,
    address,
    location,
    tags,
    photos,
  }) {
    const result = await this.updateOne(
      { _id: id },
      {
        $set: {
          name,
          address,
          location,
          tags,
          photos,
        },
      },
    );
    return result;
  }

  static async del(id) {
    const result = await this.deleteOne({ _id: id });
    return result;
  }
}

EaterySchema.loadClass(EateryClass);

const Eatery = mongoose.model('eatery', EaterySchema);

module.exports = Eatery;
