const { User, Thought } = require('../models');

module.exports = {
  //Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.status(200).json(thoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      return res.status(200).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Create thought
  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);

      const userId = req.body.userId;
      if (userId) {
        const user = await User.findByIdAndUpdate(
          userId,
          { $push: { thoughts: newThought._id } },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      } else {
        return res.status(400).json({ message: 'UserId is required' });
      }

      res.json({ message: 'New thought created successfully!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with the specified ID' });
      }

      return res
        .status(200)
        .json({ message: 'Your thought has been updated!' });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  //Delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'Oops, no such thought exists.' });
      }
      return res.status(200).json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Add reaction
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      return res
        .status(200)
        .json({ message: 'Your reaction has been posted!' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Delete reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndRemove(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      return res.status(200).json({ message: 'Reaction deleted successfully' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
