const Offer = require('../../model/Offer');
const Category = require('../../model/Category')
const { applyCategoryOffer,
    applyProductOffer,
    removeCategoryOffer,
    removeProductOffer } = require('../../Helper/offerHelperFunctiions')


// GET- Controller for get all the offers for 
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({});

        const categoryOffers = offers.filter(offer => offer.target_type === "category");
        const productOffers = offers.filter(offer => offer.target_type === "product");

        res.status(200).json({
            success: true,
            message: "Success",
            categoryOffers,
            productOffers
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


//POST--Add offer Contoller...
const addOffer = async (req, res) => {
    try {
        const { name, value, target, targetId, targetName, endDate } = req.body;

        const existingOffer = await Offer.findOne({
            target_type: target,
            target_id: targetId
        });

        const existingName = await Offer.findOne({
            name: name
        })
        if (existingName) {
            return res.status(400).json({
                success: false,
                message: "An offer with this name already exists ."
            });
        }


        if (existingOffer) {
            return res.status(400).json({
                success: false,
                message: "An offer with this name already exists for this product/category."
            });
        }

        const newOffer = await Offer.create({
            name,
            offer_value: value,
            target_type: target,
            target_id: targetId,
            target_name: targetName,
            end_date: endDate
        });

        if (target === "product") {
            await applyProductOffer(targetId, newOffer);
        } else if (target === "category") {
            await applyCategoryOffer(targetId, newOffer);
        }

        res.status(201).json({
            success:
                true,
            newOffer
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// DELETE--Delete offer controller...
const deleteOffer = async (req, res) => {
    try {
        const { offerId } = req.body;
        const existingOffer = await Offer.findById(offerId);

        if (!existingOffer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        await Offer.deleteOne({ _id: offerId });

        if (existingOffer.target_type === "product") {
            await removeProductOffer(existingOffer.target_id);
        } else if (existingOffer.target_type === "category") {
            await removeCategoryOffer(existingOffer.target_id);
        }

        return res.status(200).json({
            success: true,
            message: "Offer deleted successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



//GET---controllerfor fetch the categories in the add category dropdown dynamically...
const getCategoriesForOffer = async (req, res) => {
    try {
        const categories = await Category.find({ is_active: true }, 'name');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    addOffer,
    deleteOffer,
    getOffers,
    getCategoriesForOffer
};