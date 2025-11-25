/**
 * Place an Order
 */
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  //   const { username, email, password } = req.body;

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   res.status(400).json({ message: "User with this email already exists." });
    //   return;
    // }
    // Hash the password before saving it to the DB
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Error Registering User" });
  }
};

/**
 * List all Orders
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  //   const { username, email, password } = req.body;

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   res.status(400).json({ message: "User with this email already exists." });
    //   return;
    // }
    // Hash the password before saving it to the DB
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Error Registering User" });
  }
};

/**
 * List order by order Id
 */
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  //   const { username, email, password } = req.body;

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   res.status(400).json({ message: "User with this email already exists." });
    //   return;
    // }
    // Hash the password before saving it to the DB
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Error Registering User" });
  }
};

/**
 * Cancel Order
 */
export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  //   const { username, email, password } = req.body;

  try {
    // Check if user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   res.status(400).json({ message: "User with this email already exists." });
    //   return;
    // }
    // Hash the password before saving it to the DB
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    // res
    //   .status(201)
    //   .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Error Registering User" });
  }
};
