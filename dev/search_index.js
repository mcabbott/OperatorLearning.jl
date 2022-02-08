var documenterSearchIndex = {"docs":
[{"location":"reference/","page":"Module Reference","title":"Module Reference","text":"Modules = [OperatorLearning]","category":"page"},{"location":"reference/#OperatorLearning.DeepONet","page":"Module Reference","title":"OperatorLearning.DeepONet","text":"DeepONet(architecture_branch::Tuple, architecture_trunk::Tuple,                         act_branch = identity, act_trunk = identity;                         init_branch = Flux.glorot_uniform,                         init_trunk = Flux.glorot_uniform,                         bias_branch=true, bias_trunk=true) DeepONet(branch_net::Flux.Chain, trunk_net::Flux.Chain)\n\nCreate an (unstacked) DeepONet architecture as proposed by Lu et al. arXiv:1910.03193\n\nThe model works as follows:\n\nx –- branch –                |                 -⊠–u-                | y –- trunk –-\n\nWhere x represents the input function, discretely evaluated at its respective sensors. So the ipnut is of shape [m] for one instance or [m x b] for a training set. y are the probing locations for the operator to be trained. It has shape [N x n] for N different variables in the PDE (i.e. spatial and temporal coordinates) with each n distinct evaluation points. u is the solution of the queried instance of the PDE, given by the specific choice of parameters.\n\nBoth inputs x and y are multiplied together via dot product Σᵢ bᵢⱼ tᵢₖ.\n\nYou can set up this architecture in two ways:\n\nBy Specifying the architecture and all its parameters as given above. This always creates Dense layers for the branch and trunk net and corresponds to the DeepONet proposed by Lu et al.\nBy passing two architectures in the form of two Chain structs directly. Do this if you want more flexibility and e.g. use an RNN or CNN instead of simple Dense layers.\n\nStrictly speaking, DeepONet does not imply either of the branch or trunk net to be a simple DNN. Usually though, this is the case which is why it's treated as the default case here.\n\nExample\n\nConsider a transient 1D advection problem ∂ₜu + u ⋅ ∇u = 0, with an IC u(x,0) = g(x). We are given several (b = 200) instances of the IC, discretized at 50 points each and want to query the solution for 100 different locations and times [0;1].\n\nThat makes the branch input of shape [50 x 200] and the trunk input of shape [2 x 100]. So the input for the branch net is 50 and 100 for the trunk net.\n\nUsage\n\njulia> model = DeepONet((32,64,72), (24,64,72))\nDeepONet with\nbranch net: (Chain(Dense(32, 64), Dense(64, 72)))\nTrunk net: (Chain(Dense(24, 64), Dense(64, 72)))\n\njulia> model = DeepONet((32,64,72), (24,64,72), σ, tanh; init_branch=Flux.glorot_normal, bias_trunk=false)\nDeepONet with\nbranch net: (Chain(Dense(32, 64, σ), Dense(64, 72, σ)))\nTrunk net: (Chain(Dense(24, 64, tanh; bias=false), Dense(64, 72, tanh; bias=false)))\n\njulia> branch = Chain(Dense(2,128),Dense(128,64),Dense(64,72))\nChain(\n  Dense(2, 128),                        # 384 parameters\n  Dense(128, 64),                       # 8_256 parameters\n  Dense(64, 72),                        # 4_680 parameters\n)                   # Total: 6 arrays, 13_320 parameters, 52.406 KiB.\n\njulia> trunk = Chain(Dense(1,24),Dense(24,72))\nChain(\n  Dense(1, 24),                         # 48 parameters\n  Dense(24, 72),                        # 1_800 parameters\n)                   # Total: 4 arrays, 1_848 parameters, 7.469 KiB.\n\njulia> model = DeepONet(branch,trunk)\nDeepONet with\nbranch net: (Chain(Dense(2, 128), Dense(128, 64), Dense(64, 72)))\nTrunk net: (Chain(Dense(1, 24), Dense(24, 72)))\n\n\n\n\n\n","category":"type"},{"location":"reference/#OperatorLearning.FourierLayer","page":"Module Reference","title":"OperatorLearning.FourierLayer","text":"FourierLayer(in, out, grid, modes, σ=identity, init=glorot_uniform) FourierLayer(Wf::AbstractArray, Wl::AbstractArray, [bias_f, bias_l, σ])\n\nCreate a Layer of the Fourier Neural Operator as proposed by Li et al. arXiv: 2010.08895\n\nThe layer does a fourier transform on the grid dimension of the input array, filters higher modes out by the weight matrix and transforms it to the specified output dimension such that In x M x N -> Out x M x N. The output though only contains the relevant Fourier modes with the rest padded to zero in the last axis as a result of the filtering.\n\nThe input x should be a rank 3 tensor of shape (num parameters (in) x num grid points (grid) x batch size (batch)) The output y will be a rank 3 tensor of shape (out x num grid points (grid) x batch size (batch))\n\nYou can specify biases for the paths as you like, though the convolutional path is originally not intended to perform an affine transformation.\n\nExamples\n\nSay you're considering a 1D diffusion problem on a 64 point grid. The input is comprised of the grid points as well as the IC at this point. The data consists of 200 instances of the solution. Beforehand we convert the two input channels into a higher-dimensional latent space with 128 nodes by using a regular Dense layer. So the input takes the dimension 128 x 64 x 200. The output would be the diffused variable at a later time, which initially makes the output of the form 128 x 64 x 200 as well. Finally, we have to squeeze this high-dimensional ouptut into the one quantity of interest again by using a Dense layer.\n\nWe wish to only keep the first 16 modes of the input and work with the classic sigmoid function as activation.\n\nSo we would have:\n\nmodel = FourierLayer(128, 128, 100, 16, σ)\n\n\n\n\n\n","category":"type"},{"location":"reference/#OperatorLearning.cglorot_normal-Tuple{Random.AbstractRNG, Vararg{Any}}","page":"Module Reference","title":"OperatorLearning.cglorot_normal","text":"cglorotnormal([rng=GLOBALRNG], dims...)\n\nA modification of the glorot_normal function provided by Flux to accommodate Complex numbers. This is necessary since the parameters of the global convolution operator in the Fourier Layer generally has complex weights.\n\n\n\n\n\n","category":"method"},{"location":"reference/#OperatorLearning.cglorot_uniform-Tuple{Random.AbstractRNG, Vararg{Any}}","page":"Module Reference","title":"OperatorLearning.cglorot_uniform","text":"cglorotuniform([rng=GLOBALRNG], dims...)\n\nA modification of the glorot_uniform function provided by Flux to accommodate Complex numbers. This is necessary since the parameters of the global convolution operator in the Fourier Layer generally has complex weights.\n\n\n\n\n\n","category":"method"},{"location":"reference/#OperatorLearning.construct_subnet","page":"Module Reference","title":"OperatorLearning.construct_subnet","text":"Construct a Chain of Dense layers from a given tuple of integers.\n\nInput: A tuple (m,n,o,p) of integer type numbers that each describe the width of the i-th Dense layer to Construct\n\nOutput: A Flux Chain with length of the input tuple and individual width given by the tuple elements\n\nExample\n\njulia> model = OperatorLearning.construct_subnet((2,128,64,32,1))\nChain(\n  Dense(2, 128),                        # 384 parameters\n  Dense(128, 64),                       # 8_256 parameters\n  Dense(64, 32),                        # 2_080 parameters\n  Dense(32, 1),                         # 33 parameters\n)                   # Total: 8 arrays, 10_753 parameters, 42.504 KiB.\n\njulia> model([2,1])\n1-element Vector{Float32}:\n -0.7630446\n\n\n\n\n\n","category":"function"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = OperatorLearning","category":"page"},{"location":"#OperatorLearning","page":"Home","title":"OperatorLearning","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"A Package that provides Layers for the learning of (nonlinear) operators in order to solve parametric PDEs.","category":"page"},{"location":"","page":"Home","title":"Home","text":"note: Note\nThis package is still under heavy development and there are likely still a few things to iron out. If you find a bug or something to improve, please feel free to open a new issue or submit a PR in the GitHub Repo","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Simply install by running in a REPL:","category":"page"},{"location":"","page":"Home","title":"Home","text":"pkg> add OperatorLearning","category":"page"},{"location":"#Usage/Examples","page":"Home","title":"Usage/Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The basic workflow is more or less in line with the layer architectures that Flux provides, i.e. you construct individual layers, chain them if desired and pass the inputs as arguments to the layers.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The Fourier Layer performs a linear transform as well as convolution (linear transform in fourier space), adds them and passes it through the activation. Additionally, higher Fourier modes are filtered out in the convolution path where you can specify the amount of modes to be kept.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The syntax for a single Fourier Layer is:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using OperatorLearning\nusing Flux\n\n# Input = 101, Output = 101, Batch size = 200, Grid points = 100, Fourier modes = 16\n# Activation: sigmoid (you need to import Flux in your Script to access the activations)\nmodel = FourierLayer(101, 101, 200, 100, 16, σ)\n\n# Same as above, but perform strict convolution in Fourier Space\nmodel = FourierLayer(101, 101, 200, 100, 16, σ; bias_fourier=false)","category":"page"},{"location":"","page":"Home","title":"Home","text":"To see a full implementation, check the Burgers equation example at examples/burgers.jl.","category":"page"},{"location":"faq/#FAQ","page":"Frequently Asked Questions","title":"FAQ","text":"","category":"section"},{"location":"faq/#What's-the-status-of-this-package?","page":"Frequently Asked Questions","title":"What's the status of this package?","text":"","category":"section"},{"location":"faq/","page":"Frequently Asked Questions","title":"Frequently Asked Questions","text":"The package as a whole is still under heavy development. However, the layers and models released work well and can be used. See the examples for usage.","category":"page"},{"location":"faq/#What-do-I-need-to-train-an-operator-mapping?-What-are-the-input-data?","page":"Frequently Asked Questions","title":"What do I need to train an operator mapping? What are the input data?","text":"","category":"section"},{"location":"faq/","page":"Frequently Asked Questions","title":"Frequently Asked Questions","text":"Currently, you need solved instances of the system you're trying to approximate the solution operator of.","category":"page"},{"location":"faq/","page":"Frequently Asked Questions","title":"Frequently Asked Questions","text":"That is, you'll need to gather data (probably using numerical simulations) that include the solution vector, the grid and the parameters of the PDE (system).","category":"page"},{"location":"faq/","page":"Frequently Asked Questions","title":"Frequently Asked Questions","text":"However, future work includes implementing physics-informed operator approximations which have been shown to be able to lighten the amount of training data needed or even alleviate it altogether (see e.g. [1] or [2]).","category":"page"},{"location":"faq/#What-about-hardware-and-distributed-computing?","page":"Frequently Asked Questions","title":"What about hardware and distributed computing?","text":"","category":"section"},{"location":"faq/","page":"Frequently Asked Questions","title":"Frequently Asked Questions","text":"Just like Flux.jl, this package runs nicely on GPUs using CUDA.jl. you can simply pipe your data and function calls using |> gpu using the macro that Flux provides. For usage, see the Burgers equation example. Running on multiple GPUs has however not been tested yet.","category":"page"}]
}
