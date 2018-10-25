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
  address: String, // 주소
  lng: Number, // 경도
  lat: Number, // 위도
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
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    images: [String],
  }],
});

class EateryClass {
  static async search({ q = '*', size = 100 }) {
    const query = q.split('|');
    const sort = {};
    const recentIndex = query.indexOf('최근');
    if (recentIndex > -1) {
      sort.createdAt = -1;
      query.splice(recentIndex, 1);
    }
    const recommendIndex = query.indexOf('추천');
    if (recommendIndex > -1) {
      sort.rating = -1;
      query.splice(recommendIndex, 1);
    }
    if (!(sort.createdAt && sort.rating)) {
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
          tags: 1,
          createdAt: 1,
          images: {
            $reduce: {
              input: '$reviews.images',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
          rating: { $avg: '$reviews.rating' },
        },
      },
      {
        $sort: sort,
      },
      {
        $limit: size,
      },
      {
        $project: {
          name: 1,
          tags: 1,
          rating: 1,
          images: 1,
        },
      },
    ]);
    return results;
  }

  static async tags() {
    const results = await this.distinct('tags');
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
          localField: 'reviews.userId',
          foreignField: '_id',
          as: 'reviews.user',
        },
      },
      {
        $unwind: {
          path: '$reviews.user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          address: { $first: '$address' },
          lat: { $first: '$lat' },
          lng: { $first: '$lng' },
          tags: { $first: '$tags' },
          reviews: { $push: '$reviews' },
          images: { $push: '$reviews.images' },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          address: 1,
          lat: 1,
          lng: 1,
          tags: 1,
          rating: { $avg: '$reviews.rating' },
          reviews: {
            _id: 1,
            rating: 1,
            review: 1,
            images: 1,
            user: {
              _id: 1,
              displayName: 1,
              avatarUrl: 1,
            },
          },
          images: {
            $reduce: {
              input: '$images',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },
    ]);
    return result[0];
  }

  static async add({
                     name,
                     description,
                     address,
                     lat,
                     lng,
                     tags,
                   }) {
    const result = await this.create({
      name,
      description,
      address,
      lat,
      lng,
      tags,
    });
    return result;
  }

  static async edit({
                      id,
                      name,
                      description,
                      address,
                      lat,
                      lng,
                      tags,
                    }) {
    const result = await this.updateOne(
      { _id: id },
      {
        $set: {
          name,
          description,
          address,
          lat,
          lng,
          tags,
        },
      },
    );
    return result;
  }

  static async del(id) {
    const result = await this.deleteOne({ _id: id });
    return result;
  }

  static async addReview({
                           _id,
                           rating,
                           review,
                           images,
                           user,
                         }) {
    const result = await this.updateOne({ _id }, {
      $push: {
        reviews: {
          userId: user._id,
          rating,
          review,
          images,
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
                            images,
                          }) {
    const result = await this.updateOne({
      _id,
      'reviews._id': reviewId,
    }, {
      $set: {
        'reviews.$.rating': rating,
        'reviews.$.review': review,
        'reviews.$.images': images,
      },
    });
    return result;
  }
}

EaterySchema.loadClass(EateryClass);

const Eatery = mongoose.model('eatery', EaterySchema);

module.exports = Eatery;
