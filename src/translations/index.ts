// ─── Shared translation type ──────────────────────────────────────────────────
export type Lang = "ar" | "en";

export interface Translations {
  dir: "rtl" | "ltr";
  nav: {
    announcement: string;
    promoBar: { shipping: string; returns: string; support: string };
    collections: string;
    women: string;
    men: string;
    kids: string;
    accessories: string;
    newArrivals: string;
    sale: string;
    hot: string;
    shop: string;
    signIn: string;
    myProfile: string;
    myOrders: string;
    signOut: string;
    shopNow: string;
    register: string;
    sellOnFoda: string;
    searchPlaceholder: string;
    search: string;
  };
  hero: {
    slide1: {
      badge: string;
      line1: string;
      line2: string;
      line3: string;
      subtitle: string;
      cta1: string;
      cta2: string;
      arrivalRhythm: string;
      statDesigners: string;
      statClients: string;
      statDelivery: string;
      featuredLabel: string;
      featuredName: string;
      featuredPrice: string;
      featuredBadge: string;
      newBadge: string;
      newSub: string;
    };
    slide2: {
      badge: string;
      line1: string;
      line2: string;
      line3: string;
      subtitle: string;
      cta1: string;
      cta2: string;
      statSellers: string;
      statWilayas: string;
      statPayout: string;
    };
  };
  categories: {
    browsBy: string;
    shopBy: string;
    category: string;
    subtitle: string;
    shopNow: string;
    items: {
      women: { name: string; ar: string; count: string };
      men: { name: string; ar: string; count: string };
      kids: { name: string; ar: string; count: string };
      accessories: { name: string; ar: string; count: string };
      sale: { name: string; ar: string; count: string };
      newArrivals: { name: string; ar: string; count: string };
    };
    subs: {
      women: string[];
      men: string[];
      kids: string[];
      accessories: string[];
    };
  };
  products: {
    handpicked: string;
    trending: string;
    thisSeason: string;
    all: string;
    women: string;
    men: string;
    kids: string;
    quickView: string;
    viewAndAdd: string;
    viewAll: string;
  };
  brandStory: {
    ourStory: string;
    bornFrom: string;
    algerianPride: string;
    para1: string;
    para2: string;
    val1Title: string;
    val1Sub: string;
    val2Title: string;
    val2Sub: string;
    val3Title: string;
    val3Sub: string;
    val4Title: string;
    val4Sub: string;
    badgeYears: string;
    badgeLine1: string;
    badgeLine2: string;
    discoverBtn: string;
  };
  newsletter: {
    statCustomers: string;
    statBrands: string;
    statDelivery: string;
    statRating: string;
    labelCustomers: string;
    labelBrands: string;
    labelDelivery: string;
    labelRating: string;
    stayIn: string;
    fashionLoop: string;
    subtitle: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    successTitle: string;
    successSub: string;
    privacy: string;
  };
  sellWithUs: {
    tag: string;
    title1: string;
    title2: string;
    subtitle: string;
    step1Title: string;
    step1Sub: string;
    step2Title: string;
    step2Sub: string;
    step3Title: string;
    step3Sub: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    cta: string;
    ctaSub: string;
  };
  footer: {
    tagline: string;
    shopTitle: string;
    companyTitle: string;
    helpTitle: string;
    shopLinks: string[];
    companyLinks: string[];
    helpLinks: string[];
    address: string;
    phone: string;
    email: string;
    copyright: string;
    privacy: string;
    terms: string;
    cookies: string;
    app: { title: string; subtitle: string; scanText: string };
    social: { followUs: string; instagram: string; facebook: string; tiktok: string };
  };
  cart: {
    title: string;
    empty: string;
    emptySub: string;
    explore: string;
    addMore: string;
    freeShippingAt: string;
    qualifies: string;
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    checkout: string;
    continueShopping: string;
    remove: string;
    viewFullCart: string;
  };
  cartPage: {
    title: string;
    emptyTitle: string;
    emptySub: string;
    continueShopping: string;
    itemCount: string;
    discountCode: string;
    enterCode: string;
    apply: string;
    invalidCode: string;
    orderSummary: string;
    secureCheckout: string;
    freeShippingOver: string;
  };
  auth: {
    socialDivider: string;
    continueGoogle: string;
    continueFacebook: string;
    terms: string;
    labels: {
      fullName: string;
      email: string;
      password: string;
      confirm: string;
      code: string;
    };
    login: {
      heading: string;
      sub: string;
      tab: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      forgotPassword: string;
      submit: string;
      noAccount: string;
      createOne: string;
    };
    register: {
      heading: string;
      sub: string;
      tab: string;
      fullNamePlaceholder: string;
      shopNamePlaceholder: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      confirmPlaceholder: string;
      submit: string;
      hasAccount: string;
      signIn: string;
      strength: { weak: string; fair: string; good: string; strong: string };
    };
    reset: {
      heading: string;
      sub: string;
      description: string;
      emailPlaceholder: string;
      submit: string;
      hasPassword: string;
      signIn: string;
      checkEmail: string;
      sentMessage: string;
      backToSignIn: string;
    };
    verify: {
      heading: string;
      sub: string;
      codeSent: string;
      demoNote: string;
      codePlaceholder: string;
      submit: string;
      resend: string;
      invalidCode: string;
      resendSuccess: string;
    };
  };
  sell: {
    badge: string;
    title: string;
    subtitle: string;
    ctaStart: string;
    ctaHaveAccount: string;
    benefits: { title: string; desc: string }[];
    statsReach: string;
    statsReachLabel: string;
    statsFee: string;
    statsFeeLabel: string;
    statsSetup: string;
    statsSetupLabel: string;
    form: {
      registerHeading: string;
      registerSub: string;
      loginHeading: string;
      loginSub: string;
      shopNameLabel: string;
      shopNamePlaceholder: string;
      emailLabel: string;
      passwordLabel: string;
      submitRegister: string;
      submitLogin: string;
      switchToLogin: string;
      switchToRegister: string;
      haveAccount: string;
      noAccount: string;
      verifyHeading: string;
      verifySub: string;
      verifySubmit: string;
    };
    plans: {
      badge: string;
      title: string;
      subtitle: string;
      perMonth: string;
      mostPopular: string;
      cta: string;
      tiers: {
        name: string;
        price: string;
        priceNote: string;
        tagline: string;
        features: string[];
      }[];
    };
    testimonials: {
      badge: string;
      title: string;
      subtitle: string;
      items: { quote: string; name: string; shop: string }[];
    };
  };
  shop: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filters: string;
    priceRange: string;
    quickFilters: string;
    onSale: string;
    newArrivals: string;
    inStock: string;
    bestsellers: string;
    all: string;
    showing: string;
    products: string;
    in: string;
    resultsFor: string;
    noProducts: string;
    noProductsSub: string;
    clearFilters: string;
    // Phase 1 additions
    size: string;
    color: string;
    seller: string;
    rating: string;
    availability: string;
    allProducts: string;
    inStockOnly: string;
    andUp: string;
    applyFilters: string;
    clearAll: string;
    prev: string;
    nextPage: string;
    page: string;
    recentSearches: string;
    clear: string;
    categories: string;
    searchAllFor: string;
    noResults: string;
    retry: string;
    sortFeatured: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    soldOut: string;
    left: string;
    quickView: string;
    colors: string;
  };
  checkout: {
    title: string;
    backToCart: string;
    delivery: string;
    payment: string;
    review: string;
    success: string;
    deliveryTitle: string;
    deliverySub: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    wilaya: string;
    selectWilaya: string;
    city: string;
    notes: string;
    notesPlaceholder: string;
    nextPayment: string;
    paymentTitle: string;
    paymentSub: string;
    cod: string;
    codSub: string;
    cib: string;
    cibSub: string;
    baridimob: string;
    baridimobSub: string;
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    baridimobPhone: string;
    nextReview: string;
    reviewTitle: string;
    reviewSub: string;
    deliveryInfo: string;
    paymentMethod: string;
    orderItems: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    total: string;
    placeOrder: string;
    placing: string;
    successTitle: string;
    successSub: string;
    orderNumber: string;
    orderConfirmed: string;
    estDelivery: string;
    deliveryDays: string;
    continueShopping: string;
    backHome: string;
    change: string;
    items: string;
    comingSoon: string;
  };
  profile: {
    title: string;
    personalInfo: string;
    security: string;
    orders: string;
    signOut: string;
    account: string;
    myAccount: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    saveChanges: string;
    saving: string;
    infoSubtitle: string;
    infoSaved: string;
    emailLocked: string;
    securitySubtitle: string;
    passwordChanged: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    updating: string;
    currentPwdPlaceholder: string;
    newPwdPlaceholder: string;
    confirmPwdPlaceholder: string;
    ordersSubtitle: string;
    noOrders: string;
    noOrdersSub: string;
    startShopping: string;
    memberSince: string;
    edit: string;
    cancel: string;
    loadingOrders: string;
    ordersError: string;
    retry: string;
    orderPlaced: string;
    statusPending: string;
    statusConfirmed: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
    homeDelivery: string;
    deskPickup: string;
  };
  common: {
    dzd: string;
    free: string;
    back: string;
    next: string;
    loading: string;
    required: string;
    invalidEmail: string;
  };
  productPage: {
    addToCart: string;
    buyNow: string;
    quantity: string;
    description: string;
    youMayAlsoLike: string;
    freeDelivery: string;
    verifiedSeller: string;
    easyReturns: string;
    by: string;
  };
  wishlist: {
    title: string;
    item: string;
    items: string;
    emptyTitle: string;
    emptySub: string;
    moveToCart: string;
    signInTitle: string;
    signInSub: string;
    loading: string;
  };
  seller: {
    setup: {
      sellerSetup: string;
      finishSetup: string;
      setupDescription: string;
      deliveryCompanyTitle: string;
      deliveryCompanySub: string;
      shippingAreaTitle: string;
      shippingAreaSub: string;
      addTokenTitle: string;
      addTokenSub: string;
      onboardingRequired: string;
      deliverySetupDetails: string;
      setupDescription2: string;
      deliveryCompanyLabel: string;
      selectDeliveryCompany: string;
      wilayaLabel: string;
      selectWilaya: string;
      communeLabel: string;
      selectCommune: string;
      chooseWilayaFirst: string;
      tokenLabel: string;
      tokenPlaceholder: string;
      tokenHint: string;
      errorDeliveryCompany: string;
      errorWilaya: string;
      errorCommune: string;
      errorToken: string;
      errorSubmit: string;
      saveSetup: string;
      companies: {
        yalidine: string;
        zrExpress: string;
        dhl: string;
        algieriePoste: string;
        other: string;
      };
    };
    layout: {
      portal: string;
      menu: string;
      dashboard: string;
      myProducts: string;
      orders: string;
      trafficAnalytics: string;
      storeSettings: string;
      confirmationTeam: string;
      visitStore: string;
      seller: string;
      signOut: string;
      switchLang: string;
    };
    dash: {
      welcomeBack: string;
      storePerformance: string;
      pending: string;
      orders: string;
      addProduct: string;
      totalRevenue: string;
      fromDelivered: string;
      totalOrders: string;
      ordersForProducts: string;
      productsListed: string;
      activeMarketplace: string;
      lowStock: string;
      itemsFewUnits: string;
      quickActions: string;
      listNewProduct: string;
      viewOrders: string;
      manageOrders: string;
      editProducts: string;
      updateListings: string;
      configureStore: string;
      lowStockWarning: string;
      lowStockDesc: string;
      left: string;
      recentOrders: string;
      viewAll: string;
      orderId: string;
      date: string;
      items: string;
      total: string;
      status: string;
      units: string;
      noOrdersYet: string;
      noOrdersDesc: string;
      addFirstProduct: string;
      orderStatus: string;
      noDataYet: string;
      noDataDesc: string;
      delivered: string;
      totalOrdersLabel: string;
      profileCard: string;
      editSettings: string;
      phone: string;
      location: string;
      noPhone: string;
      noLocation: string;
      // ── Redesigned overview ──
      dashboard: string;
      gladToSeeYou: string;
      whatAwaits: string;
      catalogSize: string;
      catalogSizeSub: string;
      confirmedLifetime: string;
      confirmedLifetimeSub: string;
      pendingValue: string;
      pendingValueSub: string;
      pendingOrders: string;
      pendingOrdersSub: string;
      inventoryHealth: string;
      lowStockItems: string;
      outOfStock: string;
      totalProducts: string;
      browseInventory: string;
      recentPendingOrders: string;
      oldestFirst: string;
      noPendingOrders: string;
      noPendingDesc: string;
      item: string;
      deliveredSub: string;
    };
    form: {
      addNewProduct: string;
      editProduct: string;
      addSubtitle: string;
      editSubtitle: string;
      basicInfo: string;
      productName: string;
      productNamePlaceholder: string;
      category: string;
      catMen: string;
      catWomen: string;
      catKids: string;
      catAccessories: string;
      catOther: string;
      description: string;
      descriptionPlaceholder: string;
      pricingStock: string;
      price: string;
      stockQty: string;
      productImages: string;
      mainImage: string;
      image: string;
      clickUpload: string;
      fileTypes: string;
      change: string;
      availableSizes: string;
      availableColors: string;
      required: string;
      validPrice: string;
      validStock: string;
      variantsHelper: string;
      selectSize: string;
      selectColor: string;
      euSizes: string;
      imageRequired: string;
      productUpdated: string;
      productAdded: string;
      saveChanges: string;
      publishProduct: string;
      cancel: string;
      failedUpdate: string;
      failedAdd: string;
      // ── Brand / category / colors (full i18n) ──
      brand: string;
      brandPlaceholder: string;
      brandRequired: string;
      mainCategoryLabel: string;
      subCategoryLabel: string;
      pricePlaceholder: string;
      pricingDesc: string;
      imagesHint: string;
      dragToReorder: string;
      subCats: {
        Shirts: string;
        Pants: string;
        Dresses: string;
        Shoes: string;
        Jackets: string;
        Hoodies: string;
        Jeans: string;
        Shorts: string;
        "T-Shirts": string;
        Sweaters: string;
        Coats: string;
        Bags: string;
        Hats: string;
        Other: string;
      };
      colorNames: {
        Black: string;
        White: string;
        Beige: string;
        Gray: string;
        Brown: string;
        Navy: string;
        Red: string;
        Burgundy: string;
        Pink: string;
        Orange: string;
        Yellow: string;
        Green: string;
        Olive: string;
        Blue: string;
        Teal: string;
        Purple: string;
        Gold: string;
        Khaki: string;
      };
    };
    productsList: {
      title: string;
      listed: string;
      addProduct: string;
      noProducts: string;
      noProductsDesc: string;
      addFirstProduct: string;
      product: string;
      category: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
      outOfStock: string;
      lowStock: string;
      inStock: string;
      units: string;
      promote: string;
      edit: string;
      deleteLabel: string;
      deleteProduct: string;
      deleteConfirm: string;
      deleteWarning: string;
      deleting: string;
      deleteBtn: string;
      cancel: string;
      failedDelete: string;
    };
    inventoryPage: {
      title: string;
      subtitle: string;
      outOfStock: string;
      lowStock: string;
      inStock: string;
      summaryOutOfStock: string;
      summaryRunningLow: string;
      productSingle: string;
      productPlural: string;
      sectionHeader: string;
      stockLevels: string;
      colProduct: string;
      colStock: string;
      colSizes: string;
      colStatus: string;
      colAction: string;
      emptyTitle: string;
      emptyDesc: string;
      toastLoadError: string;
      toastInvalidStock: string;
      toastUpdated: string;
      toastUpdateError: string;
      page: string;
      of: string;
      kpiTotalActive: string;
      kpiTotalActiveDesc: string;
      kpiLowStock: string;
      kpiLowStockDesc: string;
      kpiOutOfStock: string;
      kpiOutOfStockDesc: string;
      kpiTotalUnits: string;
      kpiTotalUnitsDesc: string;
      alertTitle: string;
      alertSubtitle: string;
      alertOutOfStockSection: string;
      alertLowStockSection: string;
      units: string;
      updateStock: string;
      searchPlaceholder: string;
      matrixTitle: string;
      matrixSubtitle: string;
      matrixEmpty: string;
      saveChanges: string;
      saving: string;
      saved: string;
      unsavedChanges: string;
      resetAll: string;
      setAllTo: string;
      apply: string;
      undo: string;
      showSkus: string;
      hideSkus: string;
      sku: string;
      totalStockLabel: string;
      worstVariantLabel: string;
      filterAll: string;
      filterLow: string;
      filterOut: string;
      selectAProduct: string;
      noProductsForFilter: string;
      cancel: string;
    };
    productAnalyticsPage: {
      title: string;
      totals: string;
      unitsSold: string;
      revenue: string;
      bySize: string;
      size: string;
      noSalesYet: string;
      toastLoadError: string;
    };
    promotionsPage: {
      title: string;
      subtitle: string;
      activeSingle: string;
      activePlural: string;
      sectionHeader: string;
      productCount: string;
      colProduct: string;
      colActive: string;
      colDiscount: string;
      emptyTitle: string;
      emptyDesc: string;
      toastLoadError: string;
      toastUpdateError: string;
      toastActivated: string;
      toastPaused: string;
      toastSaved: string;
      toastSaveError: string;
      toastRemoved: string;
      toastRemoveError: string;
      save: string;
      removeTooltip: string;
      removeTitle: string;
      removeDesc: string;
      cancel: string;
      remove: string;
      productWord: string;
      noPromoLabel: string;
      statusActive: string;
      statusInactive: string;
      statusExpired: string;
      filterAll: string;
      filterActive: string;
      filterInactive: string;
      filterNoPromo: string;
      expiresOn: string;
      // ── Card view ──
      category: string;
      youSave: string;
      daysLeft: string;
      startsIn: string;
      noEndDate: string;
      wasPrice: string;
      nowPrice: string;
      ongoing: string;
    };
    ordersList: {
      title: string;
      totalOrders: string;
      all: string;
      orderId: string;
      customer: string;
      date: string;
      items: string;
      wilaya: string;
      total: string;
      status: string;
      updateStatus: string;
      noOrders: string;
      noOrdersAll: string;
      noOrdersStatus: string;
      item: string;
      orderItems: string;
      shippingDetails: string;
      customerInfo: string;
      qty: string;
      size: string;
      color: string;
      postal: string;
      homeDelivery: string;
      deskPickup: string;
      orderTotal: string;
      search: string;
      sortNewest: string;
      sortOldest: string;
      sortHighest: string;
      sortLowest: string;
      labelCol: string;
      downloadLabel: string;
      downloading: string;
      noLabel: string;
      managedBy: string;
    };
    settingsPage: {
      title: string;
      subtitle: string;
      storeIdentity: string;
      logo: string;
      storeLogo: string;
      logoHint: string;
      shopName: string;
      shopNamePlaceholder: string;
      contactInfo: string;
      phone: string;
      phonePlaceholder: string;
      email: string;
      emailDisabled: string;
      locationInfo: string;
      wilaya: string;
      selectWilaya: string;
      commune: string;
      selectCommune: string;
      chooseWilayaFirst: string;
      wilayaCommuneHint: string;
      infoBanner: string;
      saved: string;
      save: string;
      errorShopName: string;
      errorWilayaCommune: string;
      cancel: string;
    };
    pendingPage: {
      title: string;
      hello: string;
      message: string;
      step1: string;
      step2: string;
      step3: string;
      browseStore: string;
      signOut: string;
    };
    statusLabels: {
      pending: string;
      confirmed: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
    revenueAnalyticsPage: {
      title: string;
      subtitle: string;
      totalRevenue: string;
      totalRevenueDesc: string;
      pendingRevenue: string;
      pendingRevenueDesc: string;
      available: string;
      availableDesc: string;
      thisMonth: string;
      thisMonthDesc: string;
      orders: string;
      chartTitle: string;
      chartEmpty: string;
      recentOrders: string;
      noRecentOrders: string;
      viewAll: string;
      error: string;
      dzd: string;
      legendRecent: string;
      legendEarlier: string;
      trendVsPrev: string;
      orderIdLabel: string;
      locationLabel: string;
      amountLabel: string;
      statusLabels: {
        pending: string;
        confirmed: string;
        shipped: string;
        delivered: string;
        cancelled: string;
      };
    };
    trafficAnalyticsPage: {
      title: string;
      subtitle: string;
      totalVisits: string;
      totalVisitsDesc: string;
      totalOrders: string;
      totalOrdersDesc: string;
      conversionRate: string;
      conversionRateDesc: string;
      topSource: string;
      topSourceDesc: string;
      rangeToday: string;
      range7d: string;
      range30d: string;
      rangeCustom: string;
      from: string;
      to: string;
      scopeLabel: string;
      wholeStore: string;
      visitsTrend: string;
      visitsTrendEmpty: string;
      sourceBreakdown: string;
      colSource: string;
      colVisits: string;
      colShare: string;
      noSources: string;
      exportCsv: string;
      exporting: string;
      error: string;
      visits: string;
      sources: {
        instagram: string;
        tiktok: string;
        whatsapp: string;
        facebook: string;
        foda: string;
      };
    };
    trackedLinks: {
      title: string;
      subtitle: string;
      copy: string;
      copied: string;
      copyAll: string;
      hint: string;
    };
    promoModal: {
      setPromotion: string;
      promotionActive: string;
      visibleToCustomers: string;
      hiddenFromCustomers: string;
      discount: string;
      valuePlaceholderPct: string;
      valuePlaceholderAmt: string;
      pctCannotExceed: string;
      dateRange: string;
      optional: string;
      clearDates: string;
      startBeforeEnd: string;
      removeThisPromo: string;
      cancel: string;
      remove: string;
      removing: string;
      saving: string;
      savePromotion: string;
      savedSuccess: string;
      removedSuccess: string;
      failedSave: string;
      failedRemove: string;
      valueGreaterThanZero: string;
    };
    confirmatorsPage: {
      title: string;
      subtitle: string;
      invite: string;
      totalLabel: string;
      ordersConfirmedLabel: string;
      ordersCancelledLabel: string;
      activeStatus: string;
      inactiveStatus: string;
      contactSection: string;
      noPhone: string;
      joinedLabel: string;
      orderActivitySection: string;
      noOrdersYet: string;
      confirmedLabel: string;
      cancelledLabel: string;
      confirmRateLabel: string;
      totalLabel2: string;
      collapseTitle: string;
      viewDetailsTitle: string;
      removeTitle2: string;
      emptyTitle: string;
      emptyDesc: string;
      inviteFirst: string;
      loadError: string;
      removeError: string;
      inviteModalTitle: string;
      inviteModalSub: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      fieldsRequired: string;
      failedInvite: string;
      cancel: string;
      sending: string;
      sendInvitation: string;
      removeConfirmatorTitle: string;
      removeConfirmatorDesc: string;
      keep: string;
      removing: string;
      remove: string;
      overallRate: string;
      ordersHandled: string;
      inviteHint: string;
      noActivity: string;
    };
    collectionsPage: {
      title: string;
      subtitle: string;
      newCollection: string;
      searchPlaceholder: string;
      loadingLabel: string;
      collectionCount: string;
      collectionCountPlural: string;
      noCollectionsTitle: string;
      noCollectionsDesc: string;
      noSearchResults: string;
      tryDifferentKeyword: string;
      createFirst: string;
      products: string;
      productCount: string;
      productCountPlural: string;
      edit: string;
      deleteLabel: string;
      deleteTitle: string;
      deleteDesc: string;
      cancel: string;
      deleting: string;
      confirmDelete: string;
      modalTitleCreate: string;
      modalTitleEdit: string;
      namePlaceholder: string;
      nameLabel: string;
      nameRequired: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      coverLabel: string;
      coverOptional: string;
      clickToUpload: string;
      productsLabel: string;
      selectedCount: string;
      searchProducts: string;
      noProductsFound: string;
      saving: string;
      createCollection: string;
      saveChanges: string;
      failedSave: string;
      failedLoad: string;
      failedDelete: string;
      created: string;
      updated: string;
    };
    orderActions: {
      confirmTitle: string;
      cancelTitle: string;
      confirmDesc: string;
      cancelDesc: string;
      confirm: string;
      cancel: string;
      back: string;
      updating: string;
      saving: string;
      unableToUpdate: string;
    };
  };
  notFound: {
    code: string;
    title: string;
    subtitle: string;
    goHome: string;
    goShop: string;
    hint: string;
  };
  legal: {
    lastUpdated: string;
    backHome: string;
    tableOfContents: string;
    privacy: {
      badge: string;
      title: string;
      subtitle: string;
      sections: {
        title: string;
        body: string;
      }[];
    };
    terms: {
      badge: string;
      title: string;
      subtitle: string;
      sections: {
        title: string;
        body: string;
      }[];
    };
  };
}

// ─── Arabic ───────────────────────────────────────────────────────────────────
export const ar: Translations = {
  dir: "rtl",
  nav: {
    announcement: "مجموعة جديدة: ربيع 2026",
    promoBar: { shipping: "توصيل سريع", returns: "بائعين موثوقين", support: "دعم على مدار الساعة" },
    collections: "المجموعات",
    women: "نساء",
    men: "رجال",
    kids: "أطفال",
    accessories: "إكسسوارات",
    newArrivals: "وصل حديثاً",
    sale: "تخفيضات",
    hot: "رائج",
    shop: "المتجر",
    signIn: "تسجيل الدخول",
    myProfile: "ملفي الشخصي",
    myOrders: "طلباتي",
    signOut: "تسجيل الخروج",
    shopNow: "تسوق الآن",
    register: "إنشاء حساب",
    sellOnFoda: "بِع على Foda",
    searchPlaceholder: "ابحث عن منتجات، ماركات، أو متاجر...",
    search: "بحث",
  },
  hero: {
    slide1: {
      badge: "تشكيلة صيف 2026",
      line1: "ارتدي",
      line2: "الملابس",
      line3: "التي تريدها",
      subtitle: "اكتشف قطعاً فريدة من نوعها من بائعين جزائريين يفهمون ذوقك.",
      cta1: "استكشف المجموعة",
      cta2: "وصل حديثاً",
      arrivalRhythm: "قطع جديدة كل يوم ثلاثاء",
      statDesigners: "بائع نشط",
      statClients: "متسوق سعيد",
      statDelivery: "متوسط التوصيل",
      featuredLabel: "إطلالة مميزة",
      featuredName: "أناقة الصيف",
      featuredPrice: "12,500 دج",
      featuredBadge: "جديد",
      newBadge: "وصل حديثاً",
      newSub: "+120 قطعة جديدة",
    },
    slide2: {
      badge: "انضم كبائع",
      line1: "بيع",
      line2: "تصاميمك،",
      line3: "لكل الجزائر",
      subtitle: "انضم إلى أسرع سوق أزياء متنامٍ في الجزائر. أدرج منتجاتك وابدأ البيع لآلاف العملاء اليوم.",
      cta1: "ابدأ البيع",
      cta2: "اعرف المزيد",
      statSellers: "بائع نشط",
      statWilayas: "ولاية تُغطى",
      statPayout: "متوسط الدفع",
    },
  },
  categories: {
    browsBy: "تصفح حسب",
    shopBy: "تسوق حسب",
    category: "الفئة",
    subtitle: "اكتشف مجموعات مختارة بعناية من أمهر المصممين الجزائريين والحرفيين التقليديين.",
    shopNow: "تسوق الآن",
    items: {
      women: { name: "نساء", ar: "نساء", count: "+1,240 قطعة" },
      men: { name: "رجال", ar: "رجال", count: "+820 قطعة" },
      kids: { name: "أطفال", ar: "أطفال", count: "+320 قطعة" },
      accessories: { name: "إكسسوارات", ar: "إكسسوارات", count: "+340 قطعة" },
      sale: { name: "تخفيضات", ar: "تخفيضات", count: "حتى 50٪ خصم" },
      newArrivals: { name: "وصل حديثاً", ar: "وصل حديثاً", count: "+120 هذا الأسبوع" },
    },
    subs: {
      women: ["فساتين", "تيشيرتات", "أحذية", "حقائب"],
      men: ["قمصان", "سراويل", "جاكيتات", "أحذية"],
      kids: ["تيشيرتات", "سراويل", "جاكيتات", "أحذية"],
      accessories: ["حقائب", "قبعات", "أحذية", "أخرى"],
    },
  },
  products: {
    handpicked: "مختار خصيصاً لك",
    trending: "رائج",
    thisSeason: "هذا الموسم",
    all: "الكل",
    women: "نساء",
    men: "رجال",
    kids: "أطفال",
    quickView: "معاينة سريعة",
    viewAndAdd: "عرض وإضافة للسلة",
    viewAll: "عرض كل {count} منتج",
  },
  brandStory: {
    ourStory: "منصتنا",
    bornFrom: "نربط البائعين",
    algerianPride: "بالمتسوقين",
    para1: "فودة هي السوق الإلكتروني الأول للأزياء في الجزائر، صُمّم ليكون جسراً بين المصممين المحليين الموهوبين ومحبّي الموضة في أنحاء البلاد.",
    para2: "سواء كنت مشترياً يكتشف روعة الأزياء الجزائرية، أو بائعاً يرغب في تنمية علامته التجارية، توفر لك فودة الأدوات والانتشار والمجتمع للنجاح.",
    val1Title: "بائعون موثّقون",
    val1Sub: "كل بائع يخضع للتحقق لضمان الجودة والأصالة.",
    val2Title: "حماية المشتري",
    val2Sub: "تسوّق بثقة. مدفوعات آمنة وإرجاع سهل.",
    val3Title: "وصول لكل الجزائر",
    val3Sub: "التوصيل للعملاء في جميع الولايات الـ58.",
    val4Title: "أدوات نمو البائع",
    val4Sub: "لوحة تحكم متكاملة وتحليلات وإدارة الطلبات.",
    badgeYears: "+500",
    badgeLine1: "بائع نشط",
    badgeLine2: "على المنصة",
    discoverBtn: "استكشف المنصة",
  },
  newsletter: {
    statCustomers: "+50 ألف",
    statBrands: "+500",
    statDelivery: "58",
    statRating: "4.8★",
    labelCustomers: "متسوق سعيد",
    labelBrands: "بائع موثّق",
    labelDelivery: "ولاية مُغطّاة",
    labelRating: "تقييم المنصة",
    stayIn: "ابقَ على",
    fashionLoop: "موجة الموضة",
    subtitle: "اشترك للحصول على أحدث الإصدارات الحصرية وأبرز المصممين والعروض المميزة لعشاق الأزياء في الجزائر.",
    placeholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك",
    subscribing: "جارٍ الاشتراك...",
    successTitle: "أنت الآن معنا!",
    successSub: "مرحباً بك في الدائرة الداخلية لفودة.",
    privacy: "لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك.",
  },
  sellWithUs: {
    tag: "انضم كبائع",
    title1: "ابدأ البيع على",
    title2: "Foda اليوم",
    subtitle: "انضم إلى أكثر من 500 بائع يُنمّون أعمالهم على أول سوق أزياء في الجزائر.",
    step1Title: "إعداد سهل وسريع",
    step1Sub: "أنشئ متجرك في دقائق. أدرج منتجاتك وابدأ البيع فوراً.",
    step2Title: "وصول لكل الجزائر",
    step2Sub: "تواصل مع عشاق الموضة في 58 ولاية.",
    step3Title: "إدارة كل شيء",
    step3Sub: "لوحة تحكم قوية لمتابعة الطلبات والمخزون والأرباح.",
    stat1Value: "+500",
    stat1Label: "بائع نشط",
    stat2Value: "+20 ألف",
    stat2Label: "منتج مدرج",
    stat3Value: "58",
    stat3Label: "ولاية مُغطّاة",
    cta: "إنشاء حساب بائع",
    ctaSub: "مجاني تماماً — ابدأ اليوم",
  },
  footer: {
    tagline: "ارتدي الملابس بالطريقة التي لطالما تخيلتها.",
    shopTitle: "المتجر",
    companyTitle: "الشركة",
    helpTitle: "المساعدة",
    shopLinks: ["وصل حديثاً", "مجموعة النساء", "مجموعة الرجال", "أطفال", "إكسسوارات", "تخفيضات"],
    companyLinks: ["عن Foda", "الاستدامة", "الصحافة", "وظائف", "المدونة"],
    helpLinks: ["الأسئلة الشائعة", "الشحن والإرجاع", "دليل المقاسات", "تتبع الطلب", "تواصل معنا", "بطاقات الهدايا"],
    address: "- شارع محمد بوضياف , حمام الضلعة, المسيلة, 28005 المسيلة",
    phone: "+2130772788213",
    email: "support@foda.foo",
    copyright: "© {year} Foda. جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    cookies: "سياسة ملفات تعريف الارتباط",
    app: { title: "حمّل تطبيق Foda", subtitle: "تسوّق بسهولة من هاتفك", scanText: "امسح الرمز للتحميل" },
    social: { followUs: "تابعنا", instagram: "إنستغرام", facebook: "فيسبوك", tiktok: "تيك توك" },
  },
  cart: {
    title: "سلة التسوق",
    empty: "سلتك فارغة",
    emptySub: "أضف بعض القطع الجميلة للبدء",
    explore: "استكشف المجموعة",
    addMore: "تكلفة الشحن ثابتة لجميع الطلبات",
    freeShippingAt: "الشحن",
    qualifies: "يتم تطبيق الشحن على جميع الطلبات",
    subtotal: "الإجمالي الجزئي",
    shipping: "الشحن",
    free: "ثابت",
    total: "الإجمالي",
    checkout: "متابعة الدفع",
    continueShopping: "مواصلة التسوق",
    remove: "إزالة",
    viewFullCart: "عرض السلة كاملة",
  },
  cartPage: {
    title: "سلة التسوق",
    emptyTitle: "سلتك فارغة",
    emptySub: "أضف بعض المنتجات للبدء",
    continueShopping: "مواصلة التسوق",
    itemCount: "منتج",
    discountCode: "كود الخصم",
    enterCode: "أدخل الكود",
    apply: "تطبيق",
    invalidCode: "كود الخصم غير صالح",
    orderSummary: "ملخص الطلب",
    secureCheckout: "دفع آمن ومشفر",
    freeShippingOver: "شحن سريع",
  },
  auth: {
    socialDivider: "أو المتابعة بالبريد الإلكتروني",
    continueGoogle: "المتابعة عبر Google",
    continueFacebook: "المتابعة عبر Facebook",
    terms: "بالمتابعة، فإنك توافق على الشروط وسياسة الخصوصية الخاصة بنا.",
    labels: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirm: "تأكيد كلمة المرور",
      code: "رمز التحقق",
    },
    login: {
      heading: "مرحباً بعودتك",
      sub: "سجل الدخول إلى حسابك",
      tab: "تسجيل الدخول",
      emailPlaceholder: "example@email.com",
      passwordPlaceholder: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      submit: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      createOne: "أنشئ واحداً",
    },
    register: {
      heading: "انضم إلى Foda",
      sub: "أنشئ حسابك — مجاناً تماماً",
      tab: "إنشاء حساب",
      fullNamePlaceholder: "الاسم الكامل",
      shopNamePlaceholder: "اسم المتجر",
      emailPlaceholder: "example@email.com",
      passwordPlaceholder: "8 أحرف على الأقل",
      confirmPlaceholder: "أعد كلمة المرور",
      submit: "إنشاء الحساب",
      hasAccount: "لديك حساب بالفعل؟",
      signIn: "سجل الدخول",
      strength: { weak: "ضعيفة", fair: "مقبولة", good: "جيدة", strong: "قوية" },
    },
    reset: {
      heading: "استعادة كلمة المرور",
      sub: "سنرسل لك رابطاً لإعادة التعيين",
      description: "أدخل عنوان البريد الإلكتروني المرتبط بحساب فودة الخاص بك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
      emailPlaceholder: "example@email.com",
      submit: "إرسال رابط الاستعادة",
      hasPassword: "تذكرت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      checkEmail: "تحقق من بريدك الإلكتروني",
      sentMessage: "إذا كان البريد الإلكتروني {email} مسجلاً، فقد أرسلنا رابط الاستعادة.",
      backToSignIn: "العودة لتسجيل الدخول",
    },
    verify: {
      heading: "تحقق من بريدك الإلكتروني",
      sub: "أدخل الرمز المرسل إلى بريدك",
      codeSent: "تم إرسال رمز مكون من 6 أرقام إلى",
      demoNote: "تجريبي — رمزك هو",
      codePlaceholder: "000000",
      submit: "تأكيد الحساب",
      resend: "إعادة إرسال الرمز",
      invalidCode: "الرمز غير صحيح، حاول مجدداً.",
      resendSuccess: "تم إرسال رمز جديد.",
    },
  },
  sell: {
    badge: "منصة البائعين",
    title: "طوّر تجارتك مع Foda",
    subtitle: "افتح متجرك، اعرض منتجاتك أمام آلاف المتسوقين، وأدر طلباتك من لوحة تحكم واحدة بسيطة.",
    ctaStart: "ابدأ البيع الآن",
    ctaHaveAccount: "لديك متجر بالفعل؟ تسجيل الدخول",
    benefits: [
      {
        title: "وصول أوسع",
        desc: "اعرض منتجاتك أمام جمهور متنامٍ من المتسوقين عبر الجزائر.",
      },
      {
        title: "لوحة تحكم قوية",
        desc: "تابع المبيعات والمخزون والطلبات والتحليلات في مكان واحد.",
      },
      {
        title: "إعداد سريع",
        desc: "أنشئ متجرك وأضف منتجاتك خلال دقائق دون أي تعقيد.",
      },
    ],
    statsReach: "+10 آلاف",
    statsReachLabel: "متسوّق شهرياً",
    statsFee: "0 دج",
    statsFeeLabel: "رسوم الانضمام",
    statsSetup: "< 5 دقائق",
    statsSetupLabel: "لإطلاق متجرك",
    form: {
      registerHeading: "أنشئ متجرك",
      registerSub: "انضم إلى Foda كبائع — مجاناً تماماً",
      loginHeading: "مرحباً بعودتك",
      loginSub: "سجّل الدخول إلى لوحة تحكم متجرك",
      shopNameLabel: "اسم المتجر",
      shopNamePlaceholder: "متجري الرائع",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      submitRegister: "إنشاء المتجر",
      submitLogin: "تسجيل الدخول",
      switchToLogin: "تسجيل الدخول",
      switchToRegister: "إنشاء متجر",
      haveAccount: "لديك حساب بائع؟",
      noAccount: "ليس لديك متجر بعد؟",
      verifyHeading: "تحقق من بريدك الإلكتروني",
      verifySub: "أدخل الرمز المكوّن من 6 أرقام المرسل إلى بريدك",
      verifySubmit: "تأكيد وفتح اللوحة",
    },
    plans: {
      badge: "خطط الاشتراك",
      title: "اختر الخطة المناسبة لمتجرك",
      subtitle: "ابدأ مجاناً وارتقِ كلما نما متجرك. بدون عقود، يمكنك الترقية أو الإلغاء في أي وقت.",
      perMonth: "/ شهرياً",
      mostPopular: "الأكثر شيوعاً",
      cta: "ابدأ الآن",
      tiers: [
        {
          name: "المبتدئ",
          price: "0 دج",
          priceNote: "مجاني للأبد",
          tagline: "كل ما تحتاجه لإطلاق متجرك الأول.",
          features: [
            "حتى 20 منتجاً",
            "لوحة تحكم أساسية",
            "استقبال الطلبات",
            "دعم عبر البريد الإلكتروني",
          ],
        },
        {
          name: "المحترف",
          price: "2,500 دج",
          priceNote: "فوترة شهرية",
          tagline: "للبائعين المتنامين الذين يريدون البيع أكثر.",
          features: [
            "منتجات غير محدودة",
            "تحليلات متقدمة",
            "العروض والتخفيضات",
            "ربط إعلانات Meta",
            "دعم ذو أولوية",
          ],
        },
        {
          name: "الأعمال",
          price: "6,000 دج",
          priceNote: "فوترة شهرية",
          tagline: "أدوات احترافية للعلامات التجارية الكبيرة.",
          features: [
            "كل مزايا المحترف",
            "حسابات فريق متعددة",
            "إدارة المؤكدين",
            "تحليلات الإيرادات",
            "مدير حساب مخصص",
          ],
        },
      ],
    },
    testimonials: {
      badge: "قصص نجاح",
      title: "بائعون يثقون في Foda",
      subtitle: "انضم إلى مئات البائعين الذين يطوّرون أعمالهم معنا كل يوم.",
      items: [
        {
          quote: "خلال ثلاثة أشهر تضاعفت مبيعاتي. لوحة التحكم سهلة وأدوات العروض ممتازة.",
          name: "ليلى بن عمر",
          shop: "Maison Lyna",
        },
        {
          quote: "أطلقت متجري في أقل من عشر دقائق. الآن أبيع لكل ولايات الجزائر.",
          name: "كريم حدّاد",
          shop: "Atlas Wear",
        },
        {
          quote: "الدعم سريع والأرباح تصل في وقتها. أفضل منصة جربتها للبيع.",
          name: "أمينة شريف",
          shop: "Sahara Luxe",
        },
      ],
    },
  },
  shop: {
    title: "اكتشف مجموعتنا",
    subtitle: "أكثر من {count} قطعة من أفضل المصممين الجزائريين",
    searchPlaceholder: "ابحث عن منتجات وعلامات...",
    filters: "تصفية",
    priceRange: "نطاق السعر (دج)",
    quickFilters: "تصفية سريعة",
    onSale: "تخفيضات",
    newArrivals: "وصل حديثاً",
    inStock: "متوفر",
    bestsellers: "الأكثر مبيعاً",
    all: "الكل",
    showing: "يعرض",
    products: "منتجات",
    in: "في",
    resultsFor: "نتائج لـ",
    noProducts: "لا توجد منتجات",
    noProductsSub: "حاول تعديل الفلاتر أو مصطلح البحث",
    clearFilters: "مسح الفلاتر",
    size: "المقاس",
    color: "اللون",
    seller: "البائع",
    rating: "التقييم",
    availability: "التوفر",
    allProducts: "كل المنتجات",
    inStockOnly: "المتوفر فقط",
    andUp: "وأكثر",
    applyFilters: "تطبيق الفلاتر",
    clearAll: "مسح الكل",
    prev: "السابق",
    nextPage: "التالي",
    page: "صفحة",
    recentSearches: "عمليات البحث الأخيرة",
    clear: "مسح",
    categories: "الفئات",
    searchAllFor: "بحث الكل عن \"{query}\"",
    noResults: "لا توجد نتائج",
    retry: "إعادة المحاولة",
    sortFeatured: "مميز",
    sortNewest: "الأحدث أولاً",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    soldOut: "نفذ",
    left: "متبقي",
    quickView: "معاينة سريعة",
    colors: "ألوان",
  },
  checkout: {
    title: "الدفع",
    backToCart: "العودة للسلة",
    delivery: "الشحن",
    payment: "الدفع",
    review: "المراجعة والتأكيد",
    success: "ناجح",
    deliveryTitle: "معلومات التوصيل",
    deliverySub: "أين نوصل طلبك؟",
    firstName: "الاسم الأول",
    lastName: "اللقب",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    wilaya: "الولاية",
    selectWilaya: "اختر الولاية",
    city: "الحي / البلدية",
    notes: "ملاحظات (اختياري)",
    notesPlaceholder: "أي تعليمات خاصة للتوصيل...",
    nextPayment: "التالي: الدفع",
    paymentTitle: "طريقة الدفع",
    paymentSub: "جميع المعاملات آمنة ومشفرة.",
    cod: "الدفع عند الاستلام",
    codSub: "ادفع نقداً عند تسليم طلبك",
    cib: "بطاقة CIB البنكية",
    cibSub: "Visa وMastercard والبطاقات الوطنية",
    baridimob: "بريدي موب",
    baridimobSub: "دفع عبر تطبيق بريد الجزائر",
    cardNumber: "رقم البطاقة",
    cardName: "الاسم على البطاقة",
    expiry: "تاريخ الانتهاء",
    cvv: "رمز الأمان",
    baridimobPhone: "رقم هاتف بريدي موب",
    nextReview: "التالي: المراجعة والتأكيد",
    reviewTitle: "راجع وأكد طلبك",
    reviewSub: "تحقق من تفاصيل طلبك وقم بتأكيد الشراء.",
    deliveryInfo: "معلومات التوصيل",
    paymentMethod: "طريقة الدفع",
    orderItems: "المنتجات",
    orderSummary: "ملخص الطلب",
    subtotal: "الإجمالي الجزئي",
    shipping: "الشحن",
    freeShipping: "مجاناً",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    placing: "جارٍ معالجة الطلب...",
    successTitle: "تم تأكيد طلبك!",
    successSub: "شكراً لتسوقك من فودة. سيصلك طلبك قريباً.",
    orderNumber: "رقم الطلب",
    orderConfirmed: "تأكيد الطلب",
    estDelivery: "التوصيل المتوقع",
    deliveryDays: "خلال 48-72 ساعة",
    continueShopping: "مواصلة التسوق",
    backHome: "العودة للرئيسية",
    change: "تعديل",
    items: "منتجات",
    comingSoon: "قريباً",
  },
  profile: {
    title: "ملفي الشخصي",
    personalInfo: "المعلومات الشخصية",
    security: "الأمان",
    orders: "الطلبات",
    signOut: "تسجيل الخروج",
    account: "الحساب",
    myAccount: "حسابي",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    saveChanges: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    infoSubtitle: "تحديث اسمك وبياناتك الشخصية.",
    infoSaved: "تم تحديث الملف الشخصي بنجاح.",
    emailLocked: "لا يمكن تغيير البريد الإلكتروني.",
    securitySubtitle: "غيّر كلمة مرورك لحماية حسابك.",
    passwordChanged: "تم تغيير كلمة المرور بنجاح.",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updatePassword: "تحديث كلمة المرور",
    updating: "جارٍ التحديث...",
    currentPwdPlaceholder: "كلمة مرورك الحالية",
    newPwdPlaceholder: "٨ أحرف على الأقل",
    confirmPwdPlaceholder: "أعد كلمة المرور الجديدة",
    ordersSubtitle: "تتبع طلباتك السابقة وتفاصيلها.",
    noOrders: "لا توجد طلبات بعد",
    noOrdersSub: "بمجرد تقديم طلب، ستجده هنا.",
    startShopping: "ابدأ التسوق",
    memberSince: "عضو منذ",
    edit: "تعديل",
    cancel: "إلغاء",
    loadingOrders: "جارٍ تحميل الطلبات...",
    ordersError: "تعذر تحميل الطلبات. حاول مجدداً.",
    retry: "إعادة المحاولة",
    orderPlaced: "بتاريخ",
    statusPending: "قيد الانتظار",
    statusConfirmed: "تم التأكيد",
    statusShipped: "تم الشحن",
    statusDelivered: "تم التوصيل",
    statusCancelled: "ملغى",
    homeDelivery: "توصيل للمنزل",
    deskPickup: "استلام من المكتب",
  },
  common: {
    dzd: "دج",
    free: "مجاناً",
    back: "رجوع",
    next: "التالي",
    loading: "جارٍ التحميل...",
    required: "مطلوب.",
    invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",
  },
  productPage: {
    addToCart: "أضف للسلة",
    buyNow: "اشترِ الآن",
    quantity: "الكمية",
    description: "الوصف",
    youMayAlsoLike: "قد يعجبك أيضاً",
    freeDelivery: "توصيل سريع",
    verifiedSeller: "بائع موثّق",
    easyReturns: "إرجاع سهل",
    by: "من",
  },
  wishlist: {
    title: "قائمة الأمنيات",
    item: "منتج",
    items: "منتجات",
    emptyTitle: "قائمة أمنياتك فارغة",
    emptySub: "احفظ المنتجات التي تحبها وتسوقها لاحقاً.",
    moveToCart: "نقل للسلة",
    signInTitle: "سجل دخولك لعرض قائمة أمنياتك",
    signInSub: "قم بتسجيل الدخول لحفظ منتجاتك المفضلة والوصول إلى قائمة أمنياتك.",
    loading: "جاري تحميل قائمة الأمنيات…",
  },
  seller: {
    setup: {
      sellerSetup: "إعداد البائع",
      finishSetup: "أكمل إعداد متجرك",
      setupDescription: "أضف شركة التوصيل والمنطقة الجغرافية ليكون متجرك جاهزاً لاستقبال الطلبات.",
      deliveryCompanyTitle: "اختر شركة التوصيل",
      deliveryCompanySub: "اختر شركة التوصيل التي تفضل التعامل معها.",
      shippingAreaTitle: "حدّد منطقة التوصيل",
      shippingAreaSub: "اختر الولاية والبلدية لتغطية التوصيل.",
      addTokenTitle: "أضف رمز التحقق",
      addTokenSub: "سنربط تكاملك مع شركة التوصيل لاحقاً.",
      onboardingRequired: "مطلوب الإعداد",
      deliverySetupDetails: "تفاصيل إعداد التوصيل",
      setupDescription2: "سيتم حفظ هذه البيانات لاستخدامها عند تكامل API لاحقاً.",
      deliveryCompanyLabel: "شركة التوصيل",
      selectDeliveryCompany: "اختر شركة توصيل",
      wilayaLabel: "الولاية",
      selectWilaya: "اختر الولاية",
      communeLabel: "البلدية",
      selectCommune: "اختر البلدية",
      chooseWilayaFirst: "اختر الولاية أولاً",
      tokenLabel: "رمز التحقق",
      tokenPlaceholder: "أدخل رمز التحقق من شركة التوصيل",
      tokenHint: "سيُستخدم هذا الرمز لتكامل شركة التوصيل لاحقاً.",
      errorDeliveryCompany: "اختر شركة توصيل.",
      errorWilaya: "اختر الولاية.",
      errorCommune: "اختر البلدية.",
      errorToken: "أدخل رمز التحقق من شركة التوصيل.",
      errorSubmit: "تعذّر حفظ إعدادك. يرجى المحاولة مجدداً.",
      saveSetup: "حفظ الإعداد والمتابعة",
      companies: {
        yalidine: "ياليدين",
        zrExpress: "زد آر إكسبريس",
        dhl: "دي إتش إل",
        algieriePoste: "بريد الجزائر",
        other: "أخرى",
      },
    },
    layout: {
      portal: "عمليات فودا",
      menu: "القائمة",
      dashboard: "نظرة عامة",
      myProducts: "المنتجات",
      orders: "الطلبات",
      trafficAnalytics: "تحليلات الزيارات",
      storeSettings: "إعدادات المتجر",
      confirmationTeam: "فريق التأكيد",
      visitStore: "زيارة المتجر",
      seller: "بائع",
      signOut: "تسجيل الخروج",
      switchLang: "تبديل اللغة",
    },
    dash: {
      welcomeBack: "مرحباً بعودتك،",
      storePerformance: "إليك أداء متجرك اليوم.",
      pending: "قيد الانتظار",
      orders: "الطلبات",
      addProduct: "إضافة منتج",
      totalRevenue: "إجمالي الإيرادات",
      fromDelivered: "من الطلبات المُسلّمة",
      totalOrders: "إجمالي الطلبات",
      ordersForProducts: "طلبات على منتجاتك",
      productsListed: "المنتجات المدرجة",
      activeMarketplace: "نشطة في السوق",
      lowStock: "مخزون منخفض",
      itemsFewUnits: "منتجات بأقل من 5 وحدات",
      quickActions: "إجراءات سريعة",
      listNewProduct: "إدراج منتج جديد",
      viewOrders: "عرض الطلبات",
      manageOrders: "إدارة طلباتك",
      editProducts: "تعديل المنتجات",
      updateListings: "تحديث القوائم",
      configureStore: "ضبط متجرك",
      lowStockWarning: "تنبيه مخزون منخفض",
      lowStockDesc: "المنتجات التالية بها 5 وحدات أو أقل:",
      left: "متبقي",
      recentOrders: "أحدث الطلبات",
      viewAll: "عرض الكل",
      orderId: "رقم الطلب",
      date: "التاريخ",
      items: "المنتجات",
      total: "الإجمالي",
      status: "الحالة",
      units: "وحدة",
      noOrdersYet: "لا توجد طلبات بعد",
      noOrdersDesc: "ستظهر هنا طلبات منتجاتك عندما يبدأ العملاء بالشراء.",
      addFirstProduct: "أضف منتجك الأول",
      orderStatus: "حالة الطلبات",
      noDataYet: "لا توجد بيانات بعد",
      noDataDesc: "ستظهر تحليلات الطلبات هنا عند استلام طلبات.",
      delivered: "تم التوصيل",
      totalOrdersLabel: "إجمالي الطلبات",
      profileCard: "ملف المتجر",
      editSettings: "تعديل الإعدادات",
      phone: "الهاتف:",
      location: "الموقع:",
      noPhone: "لم يُضَف رقم هاتف",
      noLocation: "لم يُضَف موقع",
      // ── Redesigned overview ──
      dashboard: "لوحة المؤكد",
      gladToSeeYou: "يسعدنا رؤيتك،",
      whatAwaits: "إليك ما ينتظر اهتمامك اليوم.",
      catalogSize: "حجم الكتالوج",
      catalogSizeSub: "منخفض",
      confirmedLifetime: "المؤكدة (مدى الحياة)",
      confirmedLifetimeSub: "عبر حسابك",
      pendingValue: "القيمة المعلقة",
      pendingValueSub: "إجمالي الطلبات",
      pendingOrders: "الطلبات المعلقة",
      pendingOrdersSub: "في انتظار تأكيدك",
      inventoryHealth: "صحة المخزون",
      lowStockItems: "منتجات بمخزون منخفض",
      outOfStock: "نفد المخزون",
      totalProducts: "إجمالي المنتجات",
      browseInventory: "تصفح المخزون",
      recentPendingOrders: "الطلبات المعلقة الأخيرة",
      oldestFirst: "الأقدم له الأولوية",
      noPendingOrders: "لا طلبات معلقة",
      noPendingDesc: "كل الطلبات مؤكدة — عمل رائع!",
      item: "منتج",
      deliveredSub: "تم توصيلها",
    },
    form: {
      addNewProduct: "إضافة منتج جديد",
      editProduct: "تعديل المنتج",
      addSubtitle: "أدخل تفاصيل المنتج لإدراجه في السوق.",
      editSubtitle: "قم بتحديث تفاصيل المنتج أدناه.",
      basicInfo: "المعلومات الأساسية",
      productName: "اسم المنتج *",
      productNamePlaceholder: "مثال: فستان أنيق",
      category: "الفئة *",
      catMen: "رجال",
      catWomen: "نساء",
      catKids: "أطفال",
      catAccessories: "إكسسوارات",
      catOther: "أخرى",
      description: "الوصف",
      descriptionPlaceholder: "صف منتجك… (اختياري)",
      pricingStock: "السعر والمخزون",
      price: "السعر (دج) *",
      stockQty: "كمية المخزون *",
      productImages: "صور المنتج",
      mainImage: "الصورة الرئيسية",
      image: "صورة",
      clickUpload: "اضغط للرفع",
      fileTypes: "JPG · PNG · WEBP",
      change: "تغيير",
      availableSizes: "المقاسات المتاحة",
      availableColors: "الألوان المتاحة",
      required: "مطلوب.",
      validPrice: "أدخل سعراً صالحاً.",
      validStock: "أدخل كمية مخزون صالحة.",
      variantsHelper:
        "سيتم إنشاء متغيرات المنتج (المقاس × اللون) برصيد صفر — يمكنك ضبط الكميات لاحقاً من صفحة المخزون.",
      selectSize: "اختر مقاساً واحداً على الأقل.",
      selectColor: "اختر لوناً واحداً على الأقل.",
      euSizes: "مقاسات EU",
      imageRequired: "صورة واحدة على الأقل للمنتج مطلوبة.",
      productUpdated: "تم تحديث المنتج!",
      productAdded: "تمت إضافة المنتج!",
      saveChanges: "حفظ التغييرات",
      publishProduct: "نشر المنتج",
      cancel: "إلغاء",
      failedUpdate: "فشل تحديث المنتج.",
      failedAdd: "فشل إضافة المنتج.",
      brand: "العلامة التجارية *",
      brandPlaceholder: "مثال: Nike، Zara، علامة محلية…",
      brandRequired: "العلامة التجارية مطلوبة",
      mainCategoryLabel: "الفئة الرئيسية",
      subCategoryLabel: "الفئة الفرعية",
      pricePlaceholder: "8900",
      pricingDesc: "حدّد سعر البيع. يُضبط المخزون لكل مقاس ولون من صفحة المخزون.",
      imagesHint: "أضف حتى 5 صور. الصورة الأولى هي الرئيسية. اسحب لإعادة الترتيب.",
      dragToReorder: "اسحب لإعادة الترتيب",
      subCats: {
        Shirts: "قمصان",
        Pants: "بناطيل",
        Dresses: "فساتين",
        Shoes: "أحذية",
        Jackets: "جاكيتات",
        Hoodies: "هوديز",
        Jeans: "جينز",
        Shorts: "شورتات",
        "T-Shirts": "تيشيرتات",
        Sweaters: "كنزات",
        Coats: "معاطف",
        Bags: "حقائب",
        Hats: "قبعات",
        Other: "أخرى",
      },
      colorNames: {
        Black: "أسود",
        White: "أبيض",
        Beige: "بيج",
        Gray: "رمادي",
        Brown: "بني",
        Navy: "كحلي",
        Red: "أحمر",
        Burgundy: "خمري",
        Pink: "وردي",
        Orange: "برتقالي",
        Yellow: "أصفر",
        Green: "أخضر",
        Olive: "زيتي",
        Blue: "أزرق",
        Teal: "فيروزي",
        Purple: "بنفسجي",
        Gold: "ذهبي",
        Khaki: "كاكي",
      },
    },
    productsList: {
      title: "منتجاتي",
      listed: "منتج مدرج",
      addProduct: "إضافة منتج",
      noProducts: "لا توجد منتجات بعد",
      noProductsDesc: "أضف أول منتج لبدء البيع على فودة.",
      addFirstProduct: "إضافة أول منتج",
      product: "المنتج",
      category: "الفئة",
      price: "السعر",
      stock: "المخزون",
      status: "الحالة",
      actions: "الإجراءات",
      outOfStock: "نفد المخزون",
      lowStock: "مخزون منخفض",
      inStock: "متوفر",
      units: "وحدة",
      promote: "ترويج",
      edit: "تعديل",
      deleteLabel: "حذف",
      deleteProduct: "حذف المنتج",
      deleteConfirm: "هل أنت متأكد من حذف",
      deleteWarning: "لا يمكن التراجع عن هذا الإجراء.",
      deleting: "جارٍ الحذف…",
      deleteBtn: "حذف",
      cancel: "إلغاء",
      failedDelete: "فشل حذف المنتج.",
    },
    inventoryPage: {
      title: "المخزون",
      subtitle: "إدارة مستويات مخزون منتجاتك",
      outOfStock: "نفد المخزون",
      lowStock: "مخزون منخفض",
      inStock: "متوفر",
      summaryOutOfStock: "نفد من المخزون",
      summaryRunningLow: "مخزون منخفض",
      productSingle: "منتج",
      productPlural: "منتجات",
      sectionHeader: "مستويات المخزون",
      stockLevels: "مخزون",
      colProduct: "المنتج",
      colStock: "المخزون",
      colSizes: "المقاسات",
      colStatus: "الحالة",
      colAction: "الإجراء",
      emptyTitle: "لا توجد منتجات",
      emptyDesc: "أضف منتجات لتبدأ إدارة المخزون.",
      toastLoadError: "تعذر تحميل المخزون",
      toastInvalidStock: "يرجى إدخال رقم مخزون صالح",
      toastUpdated: "تم تحديث المخزون بنجاح",
      toastUpdateError: "تعذر تحديث المخزون",
      page: "الصفحة",
      of: "من",
      kpiTotalActive: "المنتجات النشطة",
      kpiTotalActiveDesc: "منتجات بمخزون أكبر من صفر",
      kpiLowStock: "مخزون منخفض",
      kpiLowStockDesc: "5 وحدات أو أقل",
      kpiOutOfStock: "نفد المخزون",
      kpiOutOfStockDesc: "منتجات بمخزون صفر",
      kpiTotalUnits: "إجمالي الوحدات",
      kpiTotalUnitsDesc: "مجموع الوحدات المتاحة",
      alertTitle: "تنبيهات المخزون",
      alertSubtitle: "منتجات تحتاج إلى انتباه فوري",
      alertOutOfStockSection: "نفد المخزون",
      alertLowStockSection: "مخزون منخفض",
      units: "وحدة",
      updateStock: "تحديث المخزون",
      searchPlaceholder: "البحث عن منتج...",
      matrixTitle: "مصفوفة المتغيرات",
      matrixSubtitle: "ضبط الكمية لكل (مقاس × لون)",
      matrixEmpty: "اختر منتجاً من القائمة لتعديل مخزون متغيراته.",
      saveChanges: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
      saved: "تم الحفظ",
      unsavedChanges: "تغييرات غير محفوظة",
      resetAll: "إعادة تعيين الكل إلى 0",
      setAllTo: "تعيين الكل إلى",
      apply: "تطبيق",
      undo: "تراجع",
      showSkus: "عرض رموز SKU",
      hideSkus: "إخفاء رموز SKU",
      sku: "SKU",
      totalStockLabel: "إجمالي المخزون",
      worstVariantLabel: "أقل كمية",
      filterAll: "الكل",
      filterLow: "منخفض",
      filterOut: "نفد",
      selectAProduct: "اختر منتجاً للبدء",
      noProductsForFilter: "لا توجد منتجات تطابق هذا الفلتر.",
      cancel: "إلغاء",
    },
    productAnalyticsPage: {
      title: "تحليلات المنتج",
      totals: "الإجماليات",
      unitsSold: "الوحدات المباعة",
      revenue: "الإيرادات",
      bySize: "حسب المقاس",
      size: "المقاس",
      noSalesYet: "لا توجد مبيعات لهذا المنتج بعد",
      toastLoadError: "تعذر تحميل التحليلات",
    },
    promotionsPage: {
      title: "العروض الترويجية",
      subtitle: "حدّد التخفيضات على منتجاتك وفعّلها بنقرة واحدة",
      activeSingle: "عرض نشط",
      activePlural: "عروض نشطة",
      sectionHeader: "عروض المنتجات",
      productCount: "منتج",
      colProduct: "المنتج",
      colActive: "نشط",
      colDiscount: "الخصم",
      emptyTitle: "لا توجد منتجات بعد",
      emptyDesc: "أضف منتجات إلى متجرك لبدء إعداد العروض والتخفيضات.",
      toastLoadError: "تعذر تحميل العروض",
      toastUpdateError: "تعذر التحديث",
      toastActivated: "تم تفعيل العرض",
      toastPaused: "تم إيقاف العرض",
      toastSaved: "تم حفظ العرض",
      toastSaveError: "تعذر حفظ العرض",
      toastRemoved: "تم حذف العرض",
      toastRemoveError: "تعذر حذف العرض",
      save: "حفظ",
      removeTooltip: "إزالة العرض",
      removeTitle: "إزالة العرض؟",
      removeDesc: "سيتم إزالة التخفيض من هذا المنتج نهائيًا.",
      cancel: "إلغاء",
      remove: "إزالة",
      productWord: "منتج",
      noPromoLabel: "بدون خصم",
      statusActive: "نشط",
      statusInactive: "موقوف",
      statusExpired: "منتهي",
      filterAll: "الكل",
      filterActive: "نشطة",
      filterInactive: "موقوفة",
      filterNoPromo: "بدون خصم",
      expiresOn: "تنتهي",
      category: "الفئة",
      youSave: "يوفّر العميل",
      daysLeft: "يوم متبقٍ",
      startsIn: "تبدأ بعد",
      noEndDate: "بدون تاريخ انتهاء",
      wasPrice: "كان",
      nowPrice: "الآن",
      ongoing: "مستمر",
    },
    ordersList: {
      title: "الطلبات",
      totalOrders: "إجمالي الطلبات",
      all: "الكل",
      orderId: "رقم الطلب",
      customer: "العميل",
      date: "التاريخ",
      items: "المنتجات",
      wilaya: "الولاية",
      total: "الإجمالي",
      status: "الحالة",
      updateStatus: "تحديث الحالة",
      noOrders: "لا توجد طلبات",
      noOrdersAll: "ستظهر هنا طلبات منتجاتك عندما يبدأ العملاء بالشراء.",
      noOrdersStatus: "لا توجد طلبات بحالة \"{status}\".",
      item: "منتج",
      orderItems: "عناصر الطلب",
      shippingDetails: "تفاصيل الشحن",
      customerInfo: "معلومات العميل",
      qty: "الكمية:",
      size: "المقاس:",
      color: "اللون:",
      postal: "الرمز البريدي:",
      homeDelivery: "توصيل للمنزل",
      deskPickup: "استلام من المكتب",
      orderTotal: "إجمالي الطلب",
      search: "بحث عن طلب...",
      sortNewest: "الأحدث أولاً",
      sortOldest: "الأقدم أولاً",
      sortHighest: "الأعلى سعراً",
      sortLowest: "الأقل سعراً",
      labelCol: "ملصق الشحن",
      downloadLabel: "تحميل الملصق",
      downloading: "جارٍ التحميل...",
      noLabel: "—",
      managedBy: "بواسطة",
    },
    settingsPage: {
      title: "إعدادات المتجر",
      subtitle: "خصّص ملف متجرك ومعلومات الاتصال.",
      storeIdentity: "هوية المتجر",
      logo: "الشعار",
      storeLogo: "شعار المتجر",
      logoHint: "JPG أو PNG أو WEBP. أقصى حجم 5 ميغا.",
      shopName: "اسم المتجر",
      shopNamePlaceholder: "متجر الأزياء الخاص بي",
      contactInfo: "معلومات الاتصال",
      phone: "رقم الهاتف",
      phonePlaceholder: "0555123456",
      email: "البريد الإلكتروني",
      emailDisabled: "لا يمكن تغيير البريد الإلكتروني.",
      locationInfo: "الموقع",
      wilaya: "الولاية",
      selectWilaya: "اختر الولاية",
      commune: "البلدية",
      selectCommune: "اختر البلدية",
      chooseWilayaFirst: "اختر الولاية أولاً",
      wilayaCommuneHint: "يجب إدخال الولاية والبلدية معاً.",
      infoBanner: "تأكد من صحة المعلومات قبل الحفظ. اسم المتجر يجب أن يكون فريداً.",
      saved: "تم حفظ الإعدادات!",
      save: "حفظ الإعدادات",
      errorShopName: "اسم المتجر مطلوب (3 أحرف على الأقل).",
      errorWilayaCommune: "يجب إدخال الولاية والبلدية معاً.",
      cancel: "إلغاء",
    },
    pendingPage: {
      title: "الطلب قيد المراجعة",
      hello: "مرحباً،",
      message: "حساب البائع الخاص بك بانتظار موافقة الإدارة. سيتم إبلاغك فور مراجعة طلبك.",
      step1: "تم إنشاء الحساب وتأكيد البريد",
      step2: "الإدارة تراجع طلبك",
      step3: "تمت الموافقة — دخول لوحة التحكم",
      browseStore: "تصفح المتجر",
      signOut: "تسجيل الخروج",
    },
    statusLabels: {
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغى",
    },
    revenueAnalyticsPage: {
      title: "الإيرادات",
      subtitle: "نظرة شاملة على أداء متجرك المالي",
      totalRevenue: "إجمالي الإيرادات",
      totalRevenueDesc: "جميع الطلبات غير الملغاة",
      pendingRevenue: "الإيرادات المعلقة",
      pendingRevenueDesc: "طلبات مؤكدة أو مشحونة",
      available: "الرصيد المتاح",
      availableDesc: "طلبات تم توصيلها",
      thisMonth: "إيرادات هذا الشهر",
      thisMonthDesc: "طلبات موصّلة هذا الشهر",
      orders: "طلب",
      chartTitle: "الإيرادات اليومية — آخر 30 يومًا",
      chartEmpty: "لا توجد إيرادات خلال آخر 30 يومًا",
      recentOrders: "أحدث الطلبات",
      noRecentOrders: "لا توجد طلبات بعد",
      viewAll: "عرض الكل",
      error: "تعذر تحميل بيانات الإيرادات",
      dzd: "دج",
      legendRecent: "أحدث يوم",
      legendEarlier: "أيام سابقة",
      trendVsPrev: "مقارنة بالفترة السابقة",
      orderIdLabel: "رقم الطلب",
      locationLabel: "الولاية",
      amountLabel: "المبلغ",
      statusLabels: {
        pending: "قيد الانتظار",
        confirmed: "مؤكد",
        shipped: "مشحون",
        delivered: "موصّل",
        cancelled: "ملغى",
      },
    },
    trafficAnalyticsPage: {
      title: "تحليلات حركة المرور",
      subtitle: "من أين يأتي زوار متجرك ومنتجاتك",
      totalVisits: "إجمالي الزيارات",
      totalVisitsDesc: "زيارات صفحات المنتجات",
      totalOrders: "إجمالي الطلبات",
      totalOrdersDesc: "طلبات غير ملغاة في الفترة",
      conversionRate: "معدل التحويل",
      conversionRateDesc: "طلبات ÷ زيارات",
      topSource: "أفضل مصدر",
      topSourceDesc: "الأكثر زيارة في الفترة",
      rangeToday: "اليوم",
      range7d: "7 أيام",
      range30d: "30 يومًا",
      rangeCustom: "مخصص",
      from: "من",
      to: "إلى",
      scopeLabel: "النطاق",
      wholeStore: "المتجر كامل",
      visitsTrend: "اتجاه الزيارات",
      visitsTrendEmpty: "لا توجد زيارات خلال هذه الفترة",
      sourceBreakdown: "أداء المصادر",
      colSource: "المصدر",
      colVisits: "الزيارات",
      colShare: "النسبة",
      noSources: "لا توجد بيانات مصادر بعد",
      exportCsv: "تصدير CSV",
      exporting: "جارٍ التصدير…",
      error: "تعذر تحميل تحليلات حركة المرور",
      visits: "زيارة",
      sources: {
        instagram: "إنستغرام",
        tiktok: "تيك توك",
        whatsapp: "واتساب",
        facebook: "فيسبوك",
        foda: "Foda",
      },
    },
    trackedLinks: {
      title: "روابط متتبَّعة",
      subtitle: "شارك هذه الروابط على منصاتك لتتبّع مصدر الزيارات",
      copy: "نسخ",
      copied: "تم النسخ",
      copyAll: "نسخ الكل",
      hint: "كل رابط يحمل وسم المنصة لتعرف من أين يأتي الزوار.",
    },
    promoModal: {
      setPromotion: "ضبط العرض",
      promotionActive: "العرض مُفعَّل",
      visibleToCustomers: "ظاهر للعملاء",
      hiddenFromCustomers: "مخفي عن العملاء",
      discount: "الخصم",
      valuePlaceholderPct: "مثال: 20",
      valuePlaceholderAmt: "مثال: 500",
      pctCannotExceed: "لا يمكن أن تتجاوز النسبة 100٪",
      dateRange: "الفترة الزمنية",
      optional: "(اختياري)",
      clearDates: "مسح التواريخ",
      startBeforeEnd: "يجب أن يكون تاريخ البداية قبل النهاية",
      removeThisPromo: "إزالة هذا العرض نهائياً؟",
      cancel: "إلغاء",
      remove: "إزالة",
      removing: "جارٍ الإزالة…",
      saving: "جارٍ الحفظ…",
      savePromotion: "حفظ العرض",
      savedSuccess: "تم حفظ العرض بنجاح",
      removedSuccess: "تمت إزالة العرض",
      failedSave: "تعذّر حفظ العرض",
      failedRemove: "تعذّر إزالة العرض",
      valueGreaterThanZero: "يجب أن تكون قيمة الخصم أكبر من 0",
    },
    confirmatorsPage: {
      title: "المؤكدون",
      subtitle: "إدارة من يمكنه تأكيد الطلبات وإلغاؤها نيابةً عنك.",
      invite: "دعوة",
      totalLabel: "الإجمالي",
      ordersConfirmedLabel: "طلبات مؤكدة",
      ordersCancelledLabel: "طلبات ملغاة",
      activeStatus: "نشط",
      inactiveStatus: "غير نشط",
      contactSection: "التواصل",
      noPhone: "لا يوجد هاتف",
      joinedLabel: "انضم",
      orderActivitySection: "نشاط الطلبات",
      noOrdersYet: "لا توجد طلبات بعد.",
      confirmedLabel: "مؤكدة:",
      cancelledLabel: "ملغاة:",
      confirmRateLabel: "معدل التأكيد:",
      totalLabel2: "الإجمالي",
      collapseTitle: "طيّ",
      viewDetailsTitle: "عرض التفاصيل",
      removeTitle2: "إزالة المؤكد",
      emptyTitle: "لا يوجد مؤكدون بعد",
      emptyDesc: "ادعُ شخصاً لتأكيد الطلبات وإلغائها نيابةً عنك.",
      inviteFirst: "ادعُ أول مؤكد",
      loadError: "تعذر تحميل المؤكدين.",
      removeError: "تعذر الإزالة. حاول مجدداً.",
      inviteModalTitle: "دعوة مؤكد",
      inviteModalSub: "سيتلقّى بيانات الدخول عبر البريد الإلكتروني",
      fullNameLabel: "الاسم الكامل",
      fullNamePlaceholder: "مثال: أحمد بن علي",
      emailLabel: "عنوان البريد الإلكتروني",
      emailPlaceholder: "مثال: ahmed@example.com",
      fieldsRequired: "الحقلان مطلوبان.",
      failedInvite: "تعذر إرسال الدعوة.",
      cancel: "إلغاء",
      sending: "جارٍ الإرسال…",
      sendInvitation: "إرسال الدعوة",
      removeConfirmatorTitle: "إزالة المؤكد",
      removeConfirmatorDesc: "هل أنت متأكد من إزالة {name}؟ سيفقد الوصول إلى متجرك فوراً.",
      keep: "إبقاء",
      removing: "جارٍ الإزالة…",
      remove: "إزالة",
      overallRate: "معدل التأكيد الكلي",
      ordersHandled: "طلب مُعالَج",
      inviteHint: "سيصلهم بريد إلكتروني يمنحهم صلاحية تأكيد طلباتك وإلغائها.",
      noActivity: "لا نشاط بعد",
    },
    collectionsPage: {
      title: "المجموعات",
      subtitle: "صنّف منتجاتك في مجموعات لعرض أفضل في المتجر.",
      newCollection: "مجموعة جديدة",
      searchPlaceholder: "ابحث عن مجموعة…",
      loadingLabel: "جارٍ التحميل…",
      collectionCount: "مجموعة",
      collectionCountPlural: "مجموعات",
      noCollectionsTitle: "لا توجد مجموعات بعد",
      noCollectionsDesc: "أنشئ مجموعتك الأولى لتنظيم منتجاتك وعرضها بشكل أجمل.",
      noSearchResults: "لا توجد مجموعات تطابق بحثك",
      tryDifferentKeyword: "جرّب كلمة مختلفة",
      createFirst: "إنشاء مجموعة",
      products: "منتجات",
      productCount: "منتج",
      productCountPlural: "منتجات",
      edit: "تعديل",
      deleteLabel: "حذف",
      deleteTitle: "حذف المجموعة",
      deleteDesc: "هل تريد حذف \"{name}\"؟ لا يمكن التراجع عن هذا.",
      cancel: "إلغاء",
      deleting: "جارٍ الحذف…",
      confirmDelete: "حذف",
      modalTitleCreate: "مجموعة جديدة",
      modalTitleEdit: "تعديل المجموعة",
      namePlaceholder: "مثال: صيف 2025",
      nameLabel: "اسم المجموعة",
      nameRequired: "اسم المجموعة مطلوب",
      descriptionLabel: "الوصف",
      descriptionPlaceholder: "صف هذه المجموعة…",
      coverLabel: "صورة الغلاف",
      coverOptional: "(اختياري)",
      clickToUpload: "اضغط للرفع",
      productsLabel: "المنتجات",
      selectedCount: "مُحدَّد",
      searchProducts: "ابحث عن منتج…",
      noProductsFound: "لا توجد منتجات",
      saving: "جارٍ الحفظ…",
      createCollection: "إنشاء المجموعة",
      saveChanges: "حفظ التغييرات",
      failedSave: "تعذّر حفظ المجموعة",
      failedLoad: "تعذّر تحميل المجموعات",
      failedDelete: "تعذّر حذف المجموعة",
      created: "تم إنشاء المجموعة",
      updated: "تم تحديث المجموعة",
    },
    orderActions: {
      confirmTitle: "هل تريد تأكيد هذا الطلب؟",
      cancelTitle: "هل تريد إلغاء هذا الطلب؟",
      confirmDesc: "سيتم تحديث حالة الطلب إلى تم التأكيد.",
      cancelDesc: "سيتم تحديث حالة الطلب إلى ملغى.",
      confirm: "تأكيد",
      cancel: "إلغاء",
      back: "رجوع",
      updating: "جارٍ التحديث...",
      saving: "جارٍ الحفظ...",
      unableToUpdate: "تعذر تحديث حالة الطلب",
    },
  },
  notFound: {
    code: "404",
    title: "هذه الصفحة غير موجودة",
    subtitle: "يبدو أن الرابط الذي اتبعته معطوب أو أن الصفحة قد أُزيلت.",
    goHome: "العودة للرئيسية",
    goShop: "تصفح المتجر",
    hint: "أو جرّب البحث عن شيء آخر",
  },
  legal: {
    lastUpdated: "آخر تحديث",
    backHome: "العودة إلى الرئيسية",
    tableOfContents: "المحتويات",
    privacy: {
      badge: "الخصوصية والأمان",
      title: "سياسة الخصوصية",
      subtitle: "نحن نأخذ خصوصيتك على محمل الجد. تعرّف على كيفية جمع بياناتك واستخدامها وحمايتها.",
      sections: [
        {
          title: "المعلومات التي نجمعها",
          body: "نجمع المعلومات التي تقدمها لنا مباشرةً، مثل اسمك وعنوان بريدك الإلكتروني ومعلومات الشحن وبيانات الدفع عند إنشاء حساب أو إتمام عملية شراء. كما نجمع تلقائيًا بيانات الاستخدام مثل عنوان IP ونوع المتصفح وصفحات الزيارات وأنماط التفاعل لتحسين تجربتك.",
        },
        {
          title: "كيف نستخدم معلوماتك",
          body: "نستخدم بياناتك لمعالجة طلباتك، وإرسال تأكيدات الشراء وتحديثات الشحن، وتقديم دعم العملاء، وتخصيص توصيات المنتجات. لن نبيع بياناتك الشخصية لأطراف ثالثة أبدًا. قد نشارك بيانات مجهولة الهوية مع شركاء تحليليين موثوقين لتحسين خدماتنا.",
        },
        {
          title: "ملفات تعريف الارتباط وتقنيات التتبع",
          body: "نستخدم ملفات تعريف الارتباط الأساسية للحفاظ على جلسة تسجيل دخولك وسلة التسوق. تُستخدم ملفات تعريف الارتباط الاختيارية (بموافقتك) لأغراض التحليل وتخصيص الإعلانات. يمكنك إدارة تفضيلاتك أو حذف ملفات تعريف الارتباط في أي وقت من إعدادات متصفحك.",
        },
        {
          title: "الأمان وحماية البيانات",
          body: "نحمي بياناتك باستخدام تشفير TLS لجميع عمليات النقل وتشفير كلمات المرور باستخدام bcrypt. يتم معالجة معلومات الدفع الخاصة بك من خلال بوابات آمنة متوافقة مع PCI-DSS — لا نخزن تفاصيل بطاقتك المصرفية على خوادمنا. نجري مراجعات أمنية دورية واختبارات اختراق.",
        },
        {
          title: "حقوقك",
          body: "يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت عبر لوحة ملفك الشخصي. كما يمكنك طلب نسخة من بياناتك أو الاعتراض على معالجتها. لتقديم هذه الطلبات، تواصل معنا على support@foda.foo وسنرد خلال 30 يومًا.",
        },
        {
          title: "الاحتفاظ بالبيانات",
          body: "نحتفظ ببيانات حسابك طالما كان حسابك نشطًا. عند حذف حسابك، يتم إزالة بياناتك الشخصية خلال 30 يومًا، مع الاحتفاظ بسجلات المعاملات المجهولة لأغراض الامتثال القانوني لمدة تصل إلى 5 سنوات.",
        },
        {
          title: "التواصل معنا",
          body: "إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ممارسات البيانات لدينا، يرجى التواصل مع فريق الخصوصية على support@foda.foo أو مراسلتنا على العنوان: فودة للتجارة الإلكترونية، الجزائر.",
        },
      ],
    },
    terms: {
      badge: "الشروط القانونية",
      title: "شروط الخدمة",
      subtitle: "يرجى قراءة هذه الشروط بعناية قبل استخدام منصة فودة. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط.",
      sections: [
        {
          title: "قبول الشروط",
          body: "بالوصول إلى منصة فودة أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك الوصول إلى الخدمة. هذه الشروط سارية على جميع المستخدمين بما فيهم المتسوقون والبائعون.",
        },
        {
          title: "حسابات المستخدمين",
          body: "يجب أن يكون عمرك 18 عامًا أو أكثر لإنشاء حساب. أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك وعن جميع الأنشطة التي تجري تحت حسابك. يجب الإبلاغ عن أي استخدام غير مصرح به فورًا. نحتفظ بالحق في إنهاء الحسابات التي تنتهك هذه الشروط.",
        },
        {
          title: "شروط البائعين",
          body: "يوافق البائعون المسجلون على تقديم معلومات منتجات دقيقة وشحن الطلبات في الوقت المحدد والتعامل مع المرتجعات وفقًا لسياستنا. يحق لفودة تعليق أو إنهاء حسابات البائعين الذين يخالفون معايير الجودة أو يتلقون شكاوى موثقة متكررة. يتم احتجاز المدفوعات لمدة 7 أيام بعد التسليم المؤكد.",
        },
        {
          title: "قائمة المنتجات والمحتوى المحظور",
          body: "يُحظر إدراج المنتجات المقلدة أو المسروقة أو المقيدة قانونيًا على المنصة. كذلك يُحظر المحتوى المضلل والمواد غير القانونية وأي شيء ينتهك حقوق الملكية الفكرية. نحتفظ بالحق في إزالة القوائم غير الملائمة دون سابق إنذار وتعليق الحسابات المخالفة.",
        },
        {
          title: "المدفوعات والرسوم",
          body: "جميع الأسعار بالدينار الجزائري وتشمل الضرائب المعمول بها. يتحمل البائعون رسوم خدمة المنصة المحددة في خطة اشتراكهم. نحتفظ بالحق في تعديل هيكل الرسوم مع إشعار مسبق لا يقل عن 30 يومًا. تُعالج المبالغ المستردة وفقًا لسياسة الإرجاع الخاصة بكل منتج.",
        },
        {
          title: "الملكية الفكرية",
          body: "تخضع جميع محتويات منصة فودة — بما فيها الشعارات والتصاميم والنصوص والرسومات — لحقوق الطبع والنشر الخاصة بشركة فودة. لا يجوز إعادة استخدام أي محتوى لأغراض تجارية دون إذن خطي مسبق. يحتفظ البائعون بحقوق ملكية صور منتجاتهم ومحتوياتهم.",
        },
        {
          title: "حدود المسؤولية",
          body: "تُقدَّم منصة فودة «كما هي» دون أي ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي أضرار غير مباشرة أو عرضية أو خاصة ناجمة عن استخدامك للمنصة. لا تتجاوز مسؤوليتنا القصوى في أي حال قيمة آخر معاملة أجريتها على المنصة.",
        },
        {
          title: "تسوية النزاعات",
          body: "يتفق الطرفان على السعي لحل أي نزاع وديًا خلال 30 يومًا قبل اللجوء إلى أي إجراء قانوني. تخضع هذه الاتفاقية لقانون الجمهورية الجزائرية الديمقراطية الشعبية. يكون للمحاكم الجزائرية المختصة الاختصاص الحصري بأي نزاعات.",
        },
      ],
    },
  },
};

// ─── English ──────────────────────────────────────────────────────────────────
export const en: Translations = {
  dir: "ltr",
  nav: {
    announcement: "New collection: Spring 2024",
    promoBar: { shipping: "Fast Shipping", returns: "Free 30-Day Returns", support: "24/7 Customer Support" },
    collections: "Collections",
    women: "Women",
    men: "Men",
    kids: "Kids",
    accessories: "Accessories",
    newArrivals: "New Arrivals",
    sale: "Sale",
    hot: "HOT",
    shop: "Shop",
    signIn: "Sign In",
    myProfile: "My Profile",
    myOrders: "My Orders",
    signOut: "Sign Out",
    shopNow: "Shop Now",
    register: "Register",
    sellOnFoda: "Sell on Foda",
    searchPlaceholder: "Search products, brands, or stores...",
    search: "Search",
  },
  hero: {
    slide1: {
      badge: "Summer Drop 2026",
      line1: "Algerian",
      line2: "Fashion,",
      line3: "Redefined",
      subtitle: "Discover where tradition meets modern elegance. Exclusive Algerian designers, curated for you.",
      cta1: "Explore Collection",
      cta2: "New Arrivals",
      arrivalRhythm: "New pieces every Tuesday",
      statDesigners: "Active Sellers",
      statClients: "Happy Shoppers",
      statDelivery: "Avg. Delivery",
      featuredLabel: "Featured Look",
      featuredName: "Summer Elegance",
      featuredPrice: "12,500 DZD",
      featuredBadge: "NEW",
      newBadge: "Just Dropped",
      newSub: "+120 new items",
    },
    slide2: {
      badge: "Join as a Seller",
      line1: "Sell Your",
      line2: "Designs,",
      line3: "Nationwide",
      subtitle: "Join Algeria's fastest-growing fashion marketplace. List your products and reach thousands of customers today.",
      cta1: "Start Selling",
      cta2: "Learn More",
      statSellers: "Active Sellers",
      statWilayas: "Wilayas Covered",
      statPayout: "Avg. Payout",
    },
  },
  categories: {
    browsBy: "Browse By",
    shopBy: "Shop By",
    category: "Category",
    subtitle: "Discover handpicked collections from Algeria's finest designers and traditional craftspeople.",
    shopNow: "Shop Now",
    items: {
      women: { name: "Women", ar: "نساء", count: "1,240+ styles" },
      men: { name: "Men", ar: "رجال", count: "820+ styles" },
      kids: { name: "Kids", ar: "أطفال", count: "320+ styles" },
      accessories: { name: "Accessories", ar: "إكسسوارات", count: "340+ items" },
      sale: { name: "Sale", ar: "تخفيضات", count: "Up to 50% off" },
      newArrivals: { name: "New Arrivals", ar: "وصل حديثاً", count: "120+ this week" },
    },
    subs: {
      women: ["Dresses", "T-Shirts", "Shoes", "Bags"],
      men: ["Shirts", "Pants", "Jackets", "Shoes"],
      kids: ["T-Shirts", "Pants", "Jackets", "Shoes"],
      accessories: ["Bags", "Hats", "Shoes", "Other"],
    },
  },
  products: {
    handpicked: "Handpicked For You",
    trending: "Trending",
    thisSeason: "This Season",
    all: "All",
    women: "Women",
    men: "Men",
    kids: "Kids",
    quickView: "Quick View",
    viewAndAdd: "View & Add to Cart",
    viewAll: "View All {count} Products",
  },
  brandStory: {
    ourStory: "Our Platform",
    bornFrom: "Connecting",
    algerianPride: "Algerian Fashion",
    para1: "Foda is Algeria's premier multi-seller fashion marketplace, built to bridge the gap between talented local designers and style-conscious shoppers across the country.",
    para2: "Whether you're a buyer discovering Algeria's finest fashion or a seller growing your brand, Foda gives you the tools, the reach, and the community to thrive.",
    val1Title: "Verified Sellers",
    val1Sub: "Every seller is vetted to ensure quality and authenticity for buyers.",
    val2Title: "Buyer Protection",
    val2Sub: "Shop with confidence. Secure payments, easy returns, and buyer guarantees.",
    val3Title: "Nationwide Reach",
    val3Sub: "Sellers deliver to customers across all 58 wilayas of Algeria.",
    val4Title: "Seller Growth Tools",
    val4Sub: "Dedicated dashboard, analytics, product management, and order tracking.",
    badgeYears: "500+",
    badgeLine1: "Active Sellers",
    badgeLine2: "on the Platform",
    discoverBtn: "Explore the Platform",
  },
  newsletter: {
    statCustomers: "50K+",
    statBrands: "500+",
    statDelivery: "58",
    statRating: "4.8★",
    labelCustomers: "Happy Shoppers",
    labelBrands: "Verified Sellers",
    labelDelivery: "Wilayas Covered",
    labelRating: "Platform Rating",
    stayIn: "Stay in the",
    fashionLoop: "Fashion Loop",
    subtitle: "Subscribe for exclusive drops, designer spotlights, and special offers tailored for Algeria's fashion lovers.",
    placeholder: "Enter your email address",
    subscribe: "Subscribe",
    subscribing: "Subscribing…",
    successTitle: "You're in!",
    successSub: "Welcome to Foda's inner circle.",
    privacy: "No spam. Unsubscribe anytime. We respect your privacy.",
  },
  sellWithUs: {
    tag: "Sell on Foda",
    title1: "Start Selling on",
    title2: "Foda Today",
    subtitle: "Join 500+ sellers already growing their business on Algeria's premier fashion marketplace.",
    step1Title: "Simple Setup",
    step1Sub: "Create your store in minutes. List products and start selling today.",
    step2Title: "Reach Customers Nationwide",
    step2Sub: "Connect with fashion lovers across all 58 wilayas of Algeria.",
    step3Title: "Manage Everything",
    step3Sub: "Powerful dashboard to track orders, stock, and earnings in real time.",
    stat1Value: "500+",
    stat1Label: "Active Sellers",
    stat2Value: "20K+",
    stat2Label: "Products Listed",
    stat3Value: "58",
    stat3Label: "Wilayas Covered",
    cta: "Create Seller Account",
    ctaSub: "100% Free — Start today",
  },
  footer: {
    tagline: "Algeria's premier fashion marketplace. Connecting you with the finest local designers, from the historic Casbah to the modern streets of Alger.",
    shopTitle: "Shop",
    companyTitle: "Company",
    helpTitle: "Help",
    shopLinks: ["New Arrivals", "Women's Collection", "Men's Collection", "Kids", "Accessories", "Sale"],
    companyLinks: ["About Foda", "Sustainability", "Press", "Careers", "Blog"],
    helpLinks: ["FAQ", "Shipping & Returns", "Size Guide", "Track Order", "Contact Us", "Gift Cards"],
    address: "- Mohamed Boudiof Street, Hamam Dalaâ, M'Sila, 28005 M'Sila",
    phone: "+2130772788213",
    email: "support@foda.foo",
    copyright: "© {year} Foda. All rights reserved. Made with ❤️ in Algeria.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    app: { title: "Get the Foda App", subtitle: "Shop effortlessly from your phone", scanText: "Scan to download" },
    social: { followUs: "Follow Us", instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" },
  },
  cart: {
    title: "Your Cart",
    empty: "Your cart is empty",
    emptySub: "Add some beautiful pieces to get started",
    explore: "Explore Collection",
    addMore: "Shipping fee is fixed for all orders",
    freeShippingAt: "Shipping",
    qualifies: "Shipping applies to all orders",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Fixed",
    total: "Total",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    remove: "Remove",
    viewFullCart: "View Full Cart",
  },
  cartPage: {
    title: "Shopping Cart",
    emptyTitle: "Your cart is empty",
    emptySub: "Add some items to get started",
    continueShopping: "Continue Shopping",
    itemCount: "items",
    discountCode: "Discount Code",
    enterCode: "Enter code",
    apply: "Apply",
    invalidCode: "Invalid discount code",
    orderSummary: "Order Summary",
    secureCheckout: "Secure, encrypted checkout",
    freeShippingOver: "Fast shipping",
  },
  auth: {
    socialDivider: "or continue with email",
    continueGoogle: "Continue with Google",
    continueFacebook: "Continue with Facebook",
    terms: "By continuing, you agree to our Terms & Privacy Policy.",
    labels: {
      fullName: "Full name",
      email: "Email address",
      password: "Password",
      confirm: "Confirm password",
      code: "Verification code",
    },
    login: {
      heading: "Welcome Back",
      sub: "Sign in to your Foda account",
      tab: "Sign In",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Your password",
      forgotPassword: "Forgot password?",
      submit: "Sign In",
      noAccount: "Don't have an account?",
      createOne: "Create one",
    },
    register: {
      heading: "Join Foda",
      sub: "Create your account — it's free",
      tab: "Register",
      fullNamePlaceholder: "Full name",
      shopNamePlaceholder: "Shop name",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Min. 8 characters",
      confirmPlaceholder: "Repeat password",
      submit: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      strength: { weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" },
    },
    reset: {
      heading: "Reset Password",
      sub: "We'll send you a link to reset it",
      description: "Enter the email address linked to your Foda account and we'll send you a password reset link.",
      emailPlaceholder: "you@example.com",
      submit: "Send Reset Link",
      hasPassword: "Remember your password?",
      signIn: "Sign in",
      checkEmail: "Check your email",
      sentMessage: "If {email} is registered, we've sent a reset link.",
      backToSignIn: "Back to Sign In",
    },
    verify: {
      heading: "Verify Your Email",
      sub: "Enter the code we sent you",
      codeSent: "A 6-digit code was sent to",
      demoNote: "Demo — your code is",
      codePlaceholder: "000000",
      submit: "Verify Account",
      resend: "Resend code",
      invalidCode: "Invalid code, please try again.",
      resendSuccess: "A new code has been sent.",
    },
  },
  sell: {
    badge: "Seller Platform",
    title: "Grow your business with Foda",
    subtitle: "Open your store, put your products in front of thousands of shoppers, and manage every order from one simple dashboard.",
    ctaStart: "Start selling now",
    ctaHaveAccount: "Already have a store? Sign in",
    benefits: [
      {
        title: "Wider reach",
        desc: "Showcase your products to a growing audience of shoppers across Algeria.",
      },
      {
        title: "Powerful dashboard",
        desc: "Track sales, inventory, orders and analytics — all in one place.",
      },
      {
        title: "Fast setup",
        desc: "Create your store and list products in minutes, with no hassle.",
      },
    ],
    statsReach: "10k+",
    statsReachLabel: "monthly shoppers",
    statsFee: "0 DZD",
    statsFeeLabel: "to join",
    statsSetup: "< 5 min",
    statsSetupLabel: "to go live",
    form: {
      registerHeading: "Create your store",
      registerSub: "Join Foda as a seller — it's free",
      loginHeading: "Welcome back",
      loginSub: "Sign in to your store dashboard",
      shopNameLabel: "Shop name",
      shopNamePlaceholder: "My Awesome Store",
      emailLabel: "Email address",
      passwordLabel: "Password",
      submitRegister: "Create store",
      submitLogin: "Sign in",
      switchToLogin: "Sign in",
      switchToRegister: "Create a store",
      haveAccount: "Have a seller account?",
      noAccount: "Don't have a store yet?",
      verifyHeading: "Verify your email",
      verifySub: "Enter the 6-digit code we sent to your email",
      verifySubmit: "Verify & open dashboard",
    },
    plans: {
      badge: "Subscription Plans",
      title: "Choose the plan that fits your store",
      subtitle: "Start free and scale as you grow. No contracts — upgrade or cancel anytime.",
      perMonth: "/ month",
      mostPopular: "Most Popular",
      cta: "Get started",
      tiers: [
        {
          name: "Starter",
          price: "0 DZD",
          priceNote: "Free forever",
          tagline: "Everything you need to launch your first store.",
          features: [
            "Up to 20 products",
            "Basic dashboard",
            "Order management",
            "Email support",
          ],
        },
        {
          name: "Pro",
          price: "2,500 DZD",
          priceNote: "Billed monthly",
          tagline: "For growing sellers who want to sell more.",
          features: [
            "Unlimited products",
            "Advanced analytics",
            "Promotions & discounts",
            "Meta Ads integration",
            "Priority support",
          ],
        },
        {
          name: "Business",
          price: "6,000 DZD",
          priceNote: "Billed monthly",
          tagline: "Pro tools for established brands.",
          features: [
            "Everything in Pro",
            "Multiple team seats",
            "Confirmators management",
            "Revenue analytics",
            "Dedicated account manager",
          ],
        },
      ],
    },
    testimonials: {
      badge: "Success Stories",
      title: "Sellers trust Foda",
      subtitle: "Join hundreds of sellers growing their business with us every day.",
      items: [
        {
          quote: "In three months my sales doubled. The dashboard is easy and the promotion tools are excellent.",
          name: "Leila Ben Omar",
          shop: "Maison Lyna",
        },
        {
          quote: "I launched my store in under ten minutes. Now I sell to every wilaya in Algeria.",
          name: "Karim Haddad",
          shop: "Atlas Wear",
        },
        {
          quote: "Support is fast and payouts arrive on time. The best platform I've tried for selling.",
          name: "Amina Cherif",
          shop: "Sahara Luxe",
        },
      ],
    },
  },
  shop: {
    title: "Discover Our Collection",
    subtitle: "{count} pieces from Algeria's finest designers",
    searchPlaceholder: "Search products, brands...",
    filters: "Filters",
    priceRange: "Price Range (DZD)",
    quickFilters: "Quick Filters",
    onSale: "On Sale",
    newArrivals: "New Arrivals",
    inStock: "In Stock",
    bestsellers: "Bestsellers",
    all: "All",
    showing: "Showing",
    products: "products",
    in: "in",
    resultsFor: "Results for",
    noProducts: "No products found",
    noProductsSub: "Try adjusting your filters or search term",
    clearFilters: "Clear Filters",
    size: "Size",
    color: "Color",
    seller: "Seller",
    rating: "Rating",
    availability: "Availability",
    allProducts: "All Products",
    inStockOnly: "In Stock Only",
    andUp: "& Up",
    applyFilters: "Apply Filters",
    clearAll: "Clear All",
    prev: "Previous",
    nextPage: "Next",
    page: "Page",
    recentSearches: "Recent Searches",
    clear: "Clear",
    categories: "Categories",
    searchAllFor: "Search all for \"{query}\"",
    noResults: "No results found",
    retry: "Retry",
    sortFeatured: "Featured",
    sortNewest: "Newest First",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    soldOut: "Sold Out",
    left: "left",
    quickView: "Quick View",
    colors: "colors",
  },
  checkout: {
    title: "Checkout",
    backToCart: "Back to Cart",
    delivery: "Shipping",
    payment: "Payment",
    review: "Review & Confirm",
    success: "Success",
    deliveryTitle: "Delivery Information",
    deliverySub: "Where should we deliver your order?",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    address: "Address",
    wilaya: "Wilaya",
    selectWilaya: "Select Wilaya",
    city: "Neighbourhood / Municipality",
    notes: "Notes (optional)",
    notesPlaceholder: "Any special delivery instructions…",
    nextPayment: "Next: Payment",
    paymentTitle: "Payment Method",
    paymentSub: "All transactions are secured and encrypted.",
    cod: "Cash on Delivery",
    codSub: "Pay cash when your order is delivered",
    cib: "CIB Bank Card",
    cibSub: "Visa, Mastercard & national cards",
    baridimob: "BaridiMob",
    baridimobSub: "Algérie Poste mobile payment",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    expiry: "Expiry Date",
    cvv: "CVV",
    baridimobPhone: "BaridiMob Phone Number",
    nextReview: "Next: Review & Confirm",
    reviewTitle: "Review & Confirm Your Order",
    reviewSub: "Check your order details and place your order.",
    deliveryInfo: "Delivery Info",
    paymentMethod: "Payment Method",
    orderItems: "Items",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    freeShipping: "Fixed",
    total: "Total",
    placeOrder: "Place Order",
    placing: "Processing order…",
    successTitle: "Order Confirmed!",
    successSub: "Thank you for shopping at Foda. Your order is on its way.",
    orderNumber: "Order Number",
    orderConfirmed: "Order Confirmed",
    estDelivery: "Estimated Delivery",
    deliveryDays: "Within 48–72 hours",
    continueShopping: "Continue Shopping",
    backHome: "Back to Home",
    change: "Change",
    items: "items",
    comingSoon: "Coming Soon",
  },
  profile: {
    title: "My Profile",
    personalInfo: "Personal Info",
    security: "Security",
    orders: "Orders",
    signOut: "Sign Out",
    account: "Account",
    myAccount: "My Account",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    saveChanges: "Save Changes",
    saving: "Saving…",
    infoSubtitle: "Update your name and contact details.",
    infoSaved: "Profile updated successfully.",
    emailLocked: "Email address cannot be changed.",
    securitySubtitle: "Change your password to keep your account secure.",
    passwordChanged: "Password changed successfully.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    updating: "Updating…",
    currentPwdPlaceholder: "Your current password",
    newPwdPlaceholder: "Min. 8 characters",
    confirmPwdPlaceholder: "Repeat new password",
    ordersSubtitle: "Track and manage your past orders.",
    noOrders: "No orders yet",
    noOrdersSub: "Once you place an order, it will appear here.",
    startShopping: "Start Shopping",
    memberSince: "Member since",
    edit: "Edit",
    cancel: "Cancel",
    loadingOrders: "Loading orders…",
    ordersError: "Failed to load orders. Please try again.",
    retry: "Retry",
    orderPlaced: "Placed on",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    homeDelivery: "Home Delivery",
    deskPickup: "Desk Pickup",
  },
  common: {
    dzd: "DZD",
    free: "Free",
    back: "Back",
    next: "Next",
    loading: "Loading…",
    required: "Required.",
    invalidEmail: "Enter a valid email.",
  },
  productPage: {
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    quantity: "Quantity",
    description: "Description",
    youMayAlsoLike: "You May Also Like",
    freeDelivery: "Fast Delivery",
    verifiedSeller: "Verified Seller",
    easyReturns: "Easy Returns",
    by: "by",
  },
  wishlist: {
    title: "Wishlist",
    item: "item",
    items: "items",
    emptyTitle: "Your wishlist is empty",
    emptySub: "Save items you love to your wishlist and shop them later.",
    moveToCart: "Move to Cart",
    signInTitle: "Sign in to view your wishlist",
    signInSub: "Log in to save your favourite products and access your wishlist.",
    loading: "Loading your wishlist…",
  },
  seller: {
    setup: {
      sellerSetup: "Seller setup",
      finishSetup: "Finish your store setup",
      setupDescription: "Add your delivery partner and shipping area so your store is ready for order fulfillment.",
      deliveryCompanyTitle: "Choose delivery company",
      deliveryCompanySub: "Select the courier you work with most.",
      shippingAreaTitle: "Set your shipping area",
      shippingAreaSub: "Pick your wilaya and commune for delivery coverage.",
      addTokenTitle: "Add your token",
      addTokenSub: "We'll connect your provider integration later.",
      onboardingRequired: "Onboarding required",
      deliverySetupDetails: "Delivery setup details",
      setupDescription2: "Fill these details once and we'll keep them ready for the API integration that comes next.",
      deliveryCompanyLabel: "Delivery company",
      selectDeliveryCompany: "Select a delivery company",
      wilayaLabel: "Wilaya",
      selectWilaya: "Select a wilaya",
      communeLabel: "Commune",
      selectCommune: "Select a commune",
      chooseWilayaFirst: "Choose a wilaya first",
      tokenLabel: "Delivery token",
      tokenPlaceholder: "Enter delivery company token",
      tokenHint: "The token will be used for the courier integration later.",
      errorDeliveryCompany: "Select a delivery company.",
      errorWilaya: "Select a wilaya.",
      errorCommune: "Select a commune.",
      errorToken: "Enter the delivery company token.",
      errorSubmit: "We couldn't save your setup. Please try again.",
      saveSetup: "Save setup & continue",
      companies: {
        yalidine: "Yalidine",
        zrExpress: "ZR Express",
        dhl: "DHL",
        algieriePoste: "Algérie Poste",
        other: "Other",
      },
    },
    layout: {
      portal: "FODA Operations",
      menu: "Menu",
      dashboard: "Overview",
      myProducts: "Products",
      orders: "Orders",
      trafficAnalytics: "Traffic Analytics",
      storeSettings: "Store Settings",
      confirmationTeam: "Confirmation Team",
      visitStore: "Visit Store",
      seller: "Seller",
      signOut: "Sign Out",
      switchLang: "Switch language",
    },
    dash: {
      welcomeBack: "Welcome back,",
      storePerformance: "Here's how your store is performing today.",
      pending: "pending",
      orders: "Orders",
      addProduct: "Add Product",
      totalRevenue: "Total Revenue",
      fromDelivered: "From delivered orders",
      totalOrders: "Total Orders",
      ordersForProducts: "Orders for your products",
      productsListed: "Products Listed",
      activeMarketplace: "Active in the marketplace",
      lowStock: "Low Stock",
      itemsFewUnits: "Items with 5 or fewer units",
      quickActions: "Quick Actions",
      listNewProduct: "List a new product",
      viewOrders: "View Orders",
      manageOrders: "Manage your orders",
      editProducts: "Edit Products",
      updateListings: "Update listings",
      configureStore: "Configure your store",
      lowStockWarning: "Low stock warning",
      lowStockDesc: "The following products have 5 or fewer units remaining:",
      left: "left",
      recentOrders: "Recent Orders",
      viewAll: "View all",
      orderId: "Order ID",
      date: "Date",
      items: "Items",
      total: "Total",
      status: "Status",
      units: "unit(s)",
      noOrdersYet: "No orders yet",
      noOrdersDesc: "Orders for your products will appear here once customers start buying.",
      addFirstProduct: "Add your first product",
      orderStatus: "Order Status",
      noDataYet: "No data yet",
      noDataDesc: "Order analytics will appear here once you receive orders.",
      delivered: "Delivered",
      totalOrdersLabel: "Total orders",
      profileCard: "Store Profile",
      editSettings: "Edit Settings",
      phone: "Phone:",
      location: "Location:",
      noPhone: "No phone added",
      noLocation: "No location added",
      // ── Redesigned overview ──
      dashboard: "Dashboard",
      gladToSeeYou: "Glad to see you,",
      whatAwaits: "Here's what awaits your attention today.",
      catalogSize: "Catalog Size",
      catalogSizeSub: "low",
      confirmedLifetime: "Confirmed (lifetime)",
      confirmedLifetimeSub: "across your account",
      pendingValue: "Pending Value",
      pendingValueSub: "total orders",
      pendingOrders: "Pending Orders",
      pendingOrdersSub: "awaiting your confirmation",
      inventoryHealth: "Inventory Health",
      lowStockItems: "Low stock items",
      outOfStock: "Out of stock",
      totalProducts: "Total products",
      browseInventory: "Browse Inventory",
      recentPendingOrders: "Recent Pending Orders",
      oldestFirst: "Oldest first gets priority",
      noPendingOrders: "No pending orders",
      noPendingDesc: "All orders are confirmed — great work!",
      item: "item",
      deliveredSub: "delivered",
    },
    form: {
      addNewProduct: "Add New Product",
      editProduct: "Edit Product",
      addSubtitle: "Fill in the details to list a new product.",
      editSubtitle: "Update the product details below.",
      basicInfo: "Basic Info",
      productName: "Product Name *",
      productNamePlaceholder: "e.g. Robe Élégante",
      category: "Category *",
      catMen: "Men",
      catWomen: "Women",
      catKids: "Kids",
      catAccessories: "Accessories",
      catOther: "Other",
      description: "Description",
      descriptionPlaceholder: "Describe your product… (optional)",
      pricingStock: "Pricing & Stock",
      price: "Price (DZD) *",
      stockQty: "Stock Quantity *",
      productImages: "Product Images",
      mainImage: "Main Image",
      image: "Image",
      clickUpload: "Click to upload",
      fileTypes: "JPG · PNG · WEBP",
      change: "Change",
      availableSizes: "Available Sizes",
      availableColors: "Available Colors",
      required: "Required.",
      validPrice: "Enter a valid price.",
      validStock: "Enter a valid stock quantity.",
      variantsHelper:
        "Product variants (size × color) start at 0 stock — set quantities on the Inventory page.",
      selectSize: "Select at least one size.",
      selectColor: "Select at least one color.",
      euSizes: "EU Sizes",
      imageRequired: "At least one product image is required.",
      productUpdated: "Product Updated!",
      productAdded: "Product Added!",
      saveChanges: "Save Changes",
      publishProduct: "Publish Product",
      cancel: "Cancel",
      failedUpdate: "Failed to update product.",
      failedAdd: "Failed to add product.",
      brand: "Brand *",
      brandPlaceholder: "e.g. Nike, Zara, Local Brand…",
      brandRequired: "Brand is required",
      mainCategoryLabel: "Main Category",
      subCategoryLabel: "Sub Category",
      pricePlaceholder: "8900",
      pricingDesc: "Set the selling price. Stock per size & color is set on the Inventory page.",
      imagesHint: "Add up to 5 images. The first is the main photo. Drag to reorder.",
      dragToReorder: "Drag to reorder",
      subCats: {
        Shirts: "Shirts",
        Pants: "Pants",
        Dresses: "Dresses",
        Shoes: "Shoes",
        Jackets: "Jackets",
        Hoodies: "Hoodies",
        Jeans: "Jeans",
        Shorts: "Shorts",
        "T-Shirts": "T-Shirts",
        Sweaters: "Sweaters",
        Coats: "Coats",
        Bags: "Bags",
        Hats: "Hats",
        Other: "Other",
      },
      colorNames: {
        Black: "Black",
        White: "White",
        Beige: "Beige",
        Gray: "Gray",
        Brown: "Brown",
        Navy: "Navy",
        Red: "Red",
        Burgundy: "Burgundy",
        Pink: "Pink",
        Orange: "Orange",
        Yellow: "Yellow",
        Green: "Green",
        Olive: "Olive",
        Blue: "Blue",
        Teal: "Teal",
        Purple: "Purple",
        Gold: "Gold",
        Khaki: "Khaki",
      },
    },
    productsList: {
      title: "My Products",
      listed: "listed",
      addProduct: "Add Product",
      noProducts: "No products yet",
      noProductsDesc: "Add your first product to start selling on Foda.",
      addFirstProduct: "Add First Product",
      product: "Product",
      category: "Category",
      price: "Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      outOfStock: "Out of Stock",
      lowStock: "Low Stock",
      inStock: "In Stock",
      units: "units",
      promote: "Promote",
      edit: "Edit",
      deleteLabel: "Delete",
      deleteProduct: "Delete Product",
      deleteConfirm: "Are you sure you want to delete",
      deleteWarning: "This action cannot be undone.",
      deleting: "Deleting…",
      deleteBtn: "Delete",
      cancel: "Cancel",
      failedDelete: "Failed to delete product.",
    },
    inventoryPage: {
      title: "Inventory",
      subtitle: "Manage your product stock levels",
      outOfStock: "Out of stock",
      lowStock: "Low stock",
      inStock: "In stock",
      summaryOutOfStock: "out of stock",
      summaryRunningLow: "running low",
      productSingle: "product",
      productPlural: "products",
      sectionHeader: "Stock levels",
      stockLevels: "stock",
      colProduct: "Product",
      colStock: "Stock",
      colSizes: "Sizes",
      colStatus: "Status",
      colAction: "Action",
      emptyTitle: "No products found",
      emptyDesc: "Add products to start managing inventory.",
      toastLoadError: "Failed to load inventory",
      toastInvalidStock: "Please enter a valid stock number",
      toastUpdated: "Stock updated successfully",
      toastUpdateError: "Failed to update stock",
      page: "Page",
      of: "of",
      kpiTotalActive: "Total Active Products",
      kpiTotalActiveDesc: "Products with stock above zero",
      kpiLowStock: "Low Stock Items",
      kpiLowStockDesc: "5 units or fewer remaining",
      kpiOutOfStock: "Out of Stock",
      kpiOutOfStockDesc: "Products with zero stock",
      kpiTotalUnits: "Total Units Available",
      kpiTotalUnitsDesc: "Sum of all product stock",
      alertTitle: "Stock Alerts",
      alertSubtitle: "Products requiring immediate attention",
      alertOutOfStockSection: "Out of Stock",
      alertLowStockSection: "Running Low",
      units: "units",
      updateStock: "Update Stock",
      searchPlaceholder: "Search products...",
      matrixTitle: "Variant matrix",
      matrixSubtitle: "Set stock per (size × color)",
      matrixEmpty: "Select a product from the list to edit its variant stock.",
      saveChanges: "Save changes",
      saving: "Saving...",
      saved: "Saved",
      unsavedChanges: "Unsaved changes",
      resetAll: "Reset all to 0",
      setAllTo: "Set all to",
      apply: "Apply",
      undo: "Undo",
      showSkus: "Show SKUs",
      hideSkus: "Hide SKUs",
      sku: "SKU",
      totalStockLabel: "Total stock",
      worstVariantLabel: "Lowest variant",
      filterAll: "All",
      filterLow: "Low",
      filterOut: "Out",
      selectAProduct: "Select a product to start",
      noProductsForFilter: "No products match this filter.",
      cancel: "Cancel",
    },
    productAnalyticsPage: {
      title: "Product Analytics",
      totals: "Totals",
      unitsSold: "Units Sold",
      revenue: "Revenue",
      bySize: "By Size",
      size: "Size",
      noSalesYet: "No sales for this product yet",
      toastLoadError: "Failed to load analytics",
    },
    promotionsPage: {
      title: "Promotions",
      subtitle: "Set discounts on your products and activate them in one click",
      activeSingle: "active promotion",
      activePlural: "active promotions",
      sectionHeader: "Product promotions",
      productCount: "products",
      colProduct: "Product",
      colActive: "Active",
      colDiscount: "Discount",
      emptyTitle: "No products yet",
      emptyDesc: "Add products to your store to start setting up promotions and discounts.",
      toastLoadError: "Failed to load promotions",
      toastUpdateError: "Failed to update",
      toastActivated: "Promotion activated",
      toastPaused: "Promotion paused",
      toastSaved: "Promotion saved",
      toastSaveError: "Failed to save",
      toastRemoved: "Promotion removed",
      toastRemoveError: "Failed to remove",
      save: "Save",
      removeTooltip: "Remove promotion",
      removeTitle: "Remove promotion?",
      removeDesc: "The discount will be permanently removed from this product.",
      cancel: "Cancel",
      remove: "Remove",
      productWord: "products",
      noPromoLabel: "No discount",
      statusActive: "Active",
      statusInactive: "Paused",
      statusExpired: "Expired",
      filterAll: "All",
      filterActive: "Active",
      filterInactive: "Inactive",
      filterNoPromo: "No Promo",
      expiresOn: "Expires",
      category: "Category",
      youSave: "Customer saves",
      daysLeft: "days left",
      startsIn: "starts in",
      noEndDate: "No end date",
      wasPrice: "Was",
      nowPrice: "Now",
      ongoing: "Ongoing",
    },
    ordersList: {
      title: "Orders",
      totalOrders: "total orders",
      all: "All",
      orderId: "Order ID",
      customer: "Customer",
      date: "Date",
      items: "Items",
      wilaya: "Wilaya",
      total: "Total",
      status: "Status",
      updateStatus: "Update Status",
      noOrders: "No orders",
      noOrdersAll: "Orders for your products will appear here once customers start buying.",
      noOrdersStatus: "You have no orders with the status \"{status}\".",
      item: "item",
      orderItems: "Order Items",
      shippingDetails: "Shipping Details",
      customerInfo: "Customer Info",
      qty: "Qty:",
      size: "Size:",
      color: "Color:",
      postal: "Postal:",
      homeDelivery: "Home Delivery",
      deskPickup: "Desk Pickup",
      orderTotal: "Order Total",
      search: "Search orders...",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      sortHighest: "Highest amount",
      sortLowest: "Lowest amount",
      labelCol: "Shipping Label",
      downloadLabel: "Download Label",
      downloading: "Downloading...",
      noLabel: "—",
      managedBy: "by",
    },
    settingsPage: {
      title: "Store Settings",
      subtitle: "Customize your store profile and contact information.",
      storeIdentity: "Store Identity",
      logo: "Logo",
      storeLogo: "Store Logo",
      logoHint: "JPG, PNG or WEBP. Max 5MB.",
      shopName: "Shop Name",
      shopNamePlaceholder: "My Fashion Store",
      contactInfo: "Contact Information",
      phone: "Phone Number",
      phonePlaceholder: "0555123456",
      email: "Email",
      emailDisabled: "Email cannot be changed.",
      locationInfo: "Location",
      wilaya: "Wilaya",
      selectWilaya: "Select a wilaya",
      commune: "Commune",
      selectCommune: "Select a commune",
      chooseWilayaFirst: "Choose a wilaya first",
      wilayaCommuneHint: "Wilaya and commune must be provided together.",
      infoBanner: "Make sure your info is correct before saving. Shop name must be unique.",
      saved: "Settings Saved!",
      save: "Save Settings",
      errorShopName: "Shop name is required (at least 3 characters).",
      errorWilayaCommune: "Wilaya and commune must be provided together.",
      cancel: "Cancel",
    },
    pendingPage: {
      title: "Application Under Review",
      hello: "Hello,",
      message: "Your seller account is pending admin approval. You'll be notified once your application is reviewed.",
      step1: "Account created & email verified",
      step2: "Admin reviews your application",
      step3: "Approval granted — access dashboard",
      browseStore: "Browse Store",
      signOut: "Sign Out",
    },
    statusLabels: {
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    revenueAnalyticsPage: {
      title: "Revenue",
      subtitle: "A complete overview of your store's financial performance",
      totalRevenue: "Total Revenue",
      totalRevenueDesc: "All non-cancelled orders",
      pendingRevenue: "Pending Revenue",
      pendingRevenueDesc: "Confirmed or shipped orders",
      available: "Available Balance",
      availableDesc: "Delivered orders",
      thisMonth: "This Month",
      thisMonthDesc: "Delivered orders this month",
      orders: "orders",
      chartTitle: "Daily Revenue — Last 30 Days",
      chartEmpty: "No revenue in the last 30 days",
      recentOrders: "Recent Orders",
      noRecentOrders: "No orders yet",
      viewAll: "View all",
      error: "Failed to load revenue data",
      dzd: "DZD",
      legendRecent: "Most recent",
      legendEarlier: "Earlier days",
      trendVsPrev: "vs. previous period",
      orderIdLabel: "Order",
      locationLabel: "Location",
      amountLabel: "Amount",
      statusLabels: {
        pending: "Pending",
        confirmed: "Confirmed",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
    },
    trafficAnalyticsPage: {
      title: "Traffic Analytics",
      subtitle: "See where your store and product visitors come from",
      totalVisits: "Total Visits",
      totalVisitsDesc: "Product page visits",
      totalOrders: "Total Orders",
      totalOrdersDesc: "Non-cancelled orders in range",
      conversionRate: "Conversion Rate",
      conversionRateDesc: "Orders ÷ visits",
      topSource: "Top Source",
      topSourceDesc: "Most visits in range",
      rangeToday: "Today",
      range7d: "7 days",
      range30d: "30 days",
      rangeCustom: "Custom",
      from: "From",
      to: "To",
      scopeLabel: "Scope",
      wholeStore: "Whole store",
      visitsTrend: "Visits Trend",
      visitsTrendEmpty: "No visits in this period",
      sourceBreakdown: "Source Performance",
      colSource: "Source",
      colVisits: "Visits",
      colShare: "Share",
      noSources: "No source data yet",
      exportCsv: "Export CSV",
      exporting: "Exporting…",
      error: "Failed to load traffic analytics",
      visits: "visits",
      sources: {
        instagram: "Instagram",
        tiktok: "TikTok",
        whatsapp: "WhatsApp",
        facebook: "Facebook",
        foda: "Foda",
      },
    },
    trackedLinks: {
      title: "Tracked Links",
      subtitle: "Share these links on your platforms to track where visits come from",
      copy: "Copy",
      copied: "Copied",
      copyAll: "Copy all",
      hint: "Each link carries a platform tag so you can see which channel drives traffic.",
    },
    promoModal: {
      setPromotion: "Set Promotion",
      promotionActive: "Promotion active",
      visibleToCustomers: "Visible to customers",
      hiddenFromCustomers: "Hidden from customers",
      discount: "Discount",
      valuePlaceholderPct: "e.g. 20",
      valuePlaceholderAmt: "e.g. 500",
      pctCannotExceed: "Percentage cannot exceed 100%",
      dateRange: "Date range",
      optional: "(optional)",
      clearDates: "Clear dates",
      startBeforeEnd: "Start date must be before end date",
      removeThisPromo: "Remove this promotion permanently?",
      cancel: "Cancel",
      remove: "Remove",
      removing: "Removing…",
      saving: "Saving…",
      savePromotion: "Save Promotion",
      savedSuccess: "Promotion saved successfully",
      removedSuccess: "Promotion removed",
      failedSave: "Failed to save promotion",
      failedRemove: "Failed to remove promotion",
      valueGreaterThanZero: "Discount value must be greater than 0",
    },
    confirmatorsPage: {
      title: "Confirmators",
      subtitle: "Manage who can confirm and cancel orders on your behalf.",
      invite: "Invite",
      totalLabel: "Total",
      ordersConfirmedLabel: "Orders Confirmed",
      ordersCancelledLabel: "Orders Cancelled",
      activeStatus: "Active",
      inactiveStatus: "Inactive",
      contactSection: "Contact",
      noPhone: "No phone",
      joinedLabel: "Joined",
      orderActivitySection: "Order Activity",
      noOrdersYet: "No orders handled yet.",
      confirmedLabel: "Confirmed:",
      cancelledLabel: "Cancelled:",
      confirmRateLabel: "Confirm rate:",
      totalLabel2: "total",
      collapseTitle: "Collapse",
      viewDetailsTitle: "View details",
      removeTitle2: "Remove confirmator",
      emptyTitle: "No confirmators yet",
      emptyDesc: "Invite someone to confirm and cancel orders for you.",
      inviteFirst: "Invite your first confirmator",
      loadError: "Failed to load confirmators.",
      removeError: "Failed to remove. Please try again.",
      inviteModalTitle: "Invite Confirmator",
      inviteModalSub: "They will receive login credentials by email",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "e.g. Ahmed Benali",
      emailLabel: "Email Address",
      emailPlaceholder: "e.g. ahmed@example.com",
      fieldsRequired: "Both fields are required.",
      failedInvite: "Failed to send invitation.",
      cancel: "Cancel",
      sending: "Sending…",
      sendInvitation: "Send Invitation",
      removeConfirmatorTitle: "Remove Confirmator",
      removeConfirmatorDesc: "Are you sure you want to remove {name}? They will immediately lose access to your store.",
      keep: "Keep",
      removing: "Removing…",
      remove: "Remove",
      overallRate: "Overall confirm rate",
      ordersHandled: "orders handled",
      inviteHint: "They'll receive an email granting them access to confirm and cancel your orders.",
      noActivity: "No activity yet",
    },
    collectionsPage: {
      title: "Collections",
      subtitle: "Group your products into curated collections for a better storefront.",
      newCollection: "New Collection",
      searchPlaceholder: "Search collections…",
      loadingLabel: "Loading…",
      collectionCount: "collection",
      collectionCountPlural: "collections",
      noCollectionsTitle: "No collections yet",
      noCollectionsDesc: "Create your first collection to organise your products beautifully.",
      noSearchResults: "No collections match your search",
      tryDifferentKeyword: "Try a different keyword",
      createFirst: "Create Collection",
      products: "products",
      productCount: "product",
      productCountPlural: "products",
      edit: "Edit",
      deleteLabel: "Delete",
      deleteTitle: "Delete Collection",
      deleteDesc: "Delete \"{name}\"? This cannot be undone.",
      cancel: "Cancel",
      deleting: "Deleting…",
      confirmDelete: "Delete",
      modalTitleCreate: "New Collection",
      modalTitleEdit: "Edit Collection",
      namePlaceholder: "e.g. Summer 2025",
      nameLabel: "Collection Name",
      nameRequired: "Collection name is required",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Describe this collection…",
      coverLabel: "Cover Image",
      coverOptional: "(optional)",
      clickToUpload: "Click to upload",
      productsLabel: "Products",
      selectedCount: "selected",
      searchProducts: "Search products…",
      noProductsFound: "No products found",
      saving: "Saving…",
      createCollection: "Create Collection",
      saveChanges: "Save Changes",
      failedSave: "Failed to save collection",
      failedLoad: "Failed to load collections",
      failedDelete: "Failed to delete collection",
      created: "Collection created",
      updated: "Collection updated",
    },
    orderActions: {
      confirmTitle: "Are you sure you want to confirm this order?",
      cancelTitle: "Are you sure you want to cancel this order?",
      confirmDesc: "This will update the order status to confirmed.",
      cancelDesc: "This will update the order status to cancelled.",
      confirm: "Confirm",
      cancel: "Cancel",
      back: "Back",
      updating: "Updating...",
      saving: "Saving...",
      unableToUpdate: "Unable to update order status",
    },
  },
  notFound: {
    code: "404",
    title: "This page doesn't exist",
    subtitle: "The link you followed may be broken, or the page may have been removed.",
    goHome: "Back to Home",
    goShop: "Browse the Shop",
    hint: "Or try searching for something else",
  },
  legal: {
    lastUpdated: "Last updated",
    backHome: "Back to Home",
    tableOfContents: "Table of Contents",
    privacy: {
      badge: "Privacy & Security",
      title: "Privacy Policy",
      subtitle: "We take your privacy seriously. Learn how your data is collected, used, and protected on Foda.",
      sections: [
        {
          title: "Information We Collect",
          body: "We collect information you provide directly, such as your name, email address, shipping details, and payment data when you create an account or complete a purchase. We also automatically collect usage data including IP address, browser type, pages visited, and interaction patterns to improve your experience.",
        },
        {
          title: "How We Use Your Information",
          body: "We use your data to process orders, send purchase confirmations and shipping updates, provide customer support, and personalise product recommendations. We will never sell your personal data to third parties. We may share anonymised, aggregated data with trusted analytics partners to improve our services.",
        },
        {
          title: "Cookies & Tracking Technologies",
          body: "We use essential cookies to maintain your login session and shopping cart. Optional cookies (with your consent) are used for analytics and ad personalisation. You can manage your preferences or clear cookies at any time through your browser settings.",
        },
        {
          title: "Security & Data Protection",
          body: "Your data is protected with TLS encryption for all transmissions and bcrypt password hashing. Your payment information is processed through PCI-DSS compliant secure gateways — we never store your card details on our servers. We conduct regular security audits and penetration testing.",
        },
        {
          title: "Your Rights",
          body: "You have the right to access, correct, or delete your personal data at any time through your profile dashboard. You may also request a copy of your data or object to its processing. To make these requests, contact us at support@foda.foo and we will respond within 30 days.",
        },
        {
          title: "Data Retention",
          body: "We retain your account data for as long as your account is active. When you delete your account, your personal data is removed within 30 days, while anonymised transaction records are kept for legal compliance purposes for up to 5 years.",
        },
        {
          title: "Contact Us",
          body: "If you have any questions about this Privacy Policy or our data practices, please reach out to our Privacy team at support@foda.foo or write to us at: Foda E-Commerce, Algeria.",
        },
      ],
    },
    terms: {
      badge: "Legal Terms",
      title: "Terms of Service",
      subtitle: "Please read these terms carefully before using the Foda platform. By using our services, you agree to be bound by these terms.",
      sections: [
        {
          title: "Acceptance of Terms",
          body: "By accessing or using the Foda platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the service. These terms apply to all users, including shoppers and sellers.",
        },
        {
          title: "User Accounts",
          body: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Unauthorised use must be reported immediately. We reserve the right to terminate accounts that violate these terms.",
        },
        {
          title: "Seller Terms",
          body: "Registered sellers agree to provide accurate product information, ship orders in a timely manner, and handle returns in accordance with our policy. Foda reserves the right to suspend or terminate seller accounts that fail to meet quality standards or receive repeated documented complaints. Payouts are held for 7 days after confirmed delivery.",
        },
        {
          title: "Prohibited Listings & Content",
          body: "Counterfeit, stolen, or legally restricted products are prohibited on the platform. Misleading content, illegal materials, and anything that infringes intellectual property rights are also prohibited. We reserve the right to remove non-compliant listings without notice and to suspend violating accounts.",
        },
        {
          title: "Payments & Fees",
          body: "All prices are in Algerian Dinars (DZD) and include applicable taxes. Sellers are subject to the platform service fee specified in their subscription plan. We reserve the right to adjust our fee structure with a minimum of 30 days' notice. Refunds are processed according to each product's return policy.",
        },
        {
          title: "Intellectual Property",
          body: "All Foda platform content — including logos, designs, text, and graphics — is protected by copyright belonging to Foda. No content may be reused for commercial purposes without prior written permission. Sellers retain ownership of their product images and listings content.",
        },
        {
          title: "Limitation of Liability",
          body: "The Foda platform is provided 'as is' without any express or implied warranties. We are not liable for any indirect, incidental, or special damages arising from your use of the platform. Our maximum liability in any case shall not exceed the value of your most recent transaction on the platform.",
        },
        {
          title: "Dispute Resolution",
          body: "Both parties agree to seek an amicable resolution to any dispute within 30 days before pursuing any legal action. This agreement is governed by the laws of the People's Democratic Republic of Algeria. Competent Algerian courts shall have exclusive jurisdiction over any disputes.",
        },
      ],
    },
  },
};

export const translations: Record<Lang, Translations> = { ar, en };
