package com.mjtech.sandaga.service.impl;

import com.mjtech.sandaga.dtos.address.AddressDto;
import com.mjtech.sandaga.dtos.contact.ContactDto;
import com.mjtech.sandaga.dtos.mondialrelay.CreationEtiquetteReqDto;
import com.mjtech.sandaga.dtos.mondialrelay.CreationEtiquetteResDto;
import com.mjtech.sandaga.dtos.payment.*;
import com.mjtech.sandaga.entity.*;
import com.mjtech.sandaga.enums.ads.Status;
import com.mjtech.sandaga.enums.notification.NotificationStatus;
import com.mjtech.sandaga.enums.payment.PaymentStatus;
import com.mjtech.sandaga.enums.payment.ShippingStatus;
import com.mjtech.sandaga.enums.payment.ShippingStep;
import com.mjtech.sandaga.exception.GenericAlreadyExistsException;
import com.mjtech.sandaga.exception.ResourceNotFoundException;
import com.mjtech.sandaga.repository.AdsRepository;
import com.mjtech.sandaga.repository.PaymentRepository;
import com.mjtech.sandaga.service.*;
import com.mjtech.sandaga.utility.dto.Image;
import com.mjtech.sandaga.utility.dto.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Refund;
import com.stripe.model.Transfer;
import com.stripe.model.oauth.TokenResponse;
import com.stripe.net.OAuth;
import com.stripe.param.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    @Value("${stripe.stripe_secret_key}")
    private String stripeSecretKey;
    private final PaymentRepository paymentRepository;
    private final AdsRepository adsRepository;

    private final UserService userService;

    private final ShippingService shippingService;

    private final MondialRelayService mondialRelayService;

    private final ShippingStepService shippingStepService;

    private final NotificationService notificationService;
    private final EmailService emailService;

    private final ContactService contactService;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    public PaymentServiceImpl(PaymentRepository paymentRepository,  AdsRepository adsRepository, UserService userService, ShippingService shippingService, MondialRelayService mondialRelayService, ShippingStepService shippingStepService, NotificationService notificationService, EmailService emailService, ContactService contactService) {
        this.paymentRepository = paymentRepository;
        this.adsRepository = adsRepository;
        this.userService = userService;
        this.shippingService = shippingService;
        this.mondialRelayService = mondialRelayService;
        this.shippingStepService = shippingStepService;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.contactService = contactService;
    }

    @Override
    public PaymentEntity getPaymentById(UUID id) {
        Optional<PaymentEntity> payment = paymentRepository.findById(id);

        if (payment.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found!");
        }

        return payment.get();
    }

    @Override
    public PaymentListResDto getUserPayment(Principal principal, PaymentPageReqDto paymentPageReqDto) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        Pageable pageable = PageRequest.of(paymentPageReqDto.getCurrentPage() - 1, paymentPageReqDto.getLimit());

        Page<PaymentEntity> page = paymentRepository.findPaymentEntityByBuyerIdOrSellerId(user.getId(), user.getId(), pageable);

        return PaymentListResDto.builder()
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalElements())
                .payments(Payment.toPaymentDtoList(page.getContent()))
                .build();
    }

    @Override
    public PaymentEntity getPaymentByPurchaseId(Long purchaseId) {
        Optional<PaymentEntity> payment = paymentRepository.findPaymentEntityByPurchaseId(purchaseId);

        if (payment.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found!");
        }

        return payment.get();
    }

    @Override
    public PaymentEntity createPayment(PaymentEntity payment) {
        Optional<PaymentEntity> existsPayment = paymentRepository.findPaymentEntityByPurchaseId(payment.getPurchaseId());

        if (existsPayment.isPresent()) {
            throw new GenericAlreadyExistsException("Payment already exists");
        }

        return paymentRepository.save(payment);
    }
    @Override
    public PaymentInitResDto getPaymentInitInfo(long purchaseId, Principal principal) {
       PaymentEntity payment = paymentRepository.findPaymentEntityByPurchaseId(purchaseId)
               .orElseThrow(() -> new ResourceNotFoundException("Payment not found!"));


        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found!"));

        if (!ads.getStatus().equals(Status.active)) {
            throw new ResourceNotFoundException("Ads not found!");
        }

        UserEntity buyer = userService.findUserByEmail(principal.getName());
        UserEntity seller = userService.getUserById(String.valueOf(ads.getUser().getId()));

        String imageName = null;

        if (!Image.toDtoList(ads.getImages()).isEmpty()) {
            imageName = Image.toDtoList(ads.getImages()).get(0).getName();
        }

     List<String> ordoring = new ArrayList<>();
        String selected = "";
        String shipping_cost = ads.getShipping_cost();
        ordoring.add("face-to-face");
        if (shipping_cost != null && shipping_cost.split(",").length == 2) {
            ordoring.add(shipping_cost.split(",")[0]);
            ordoring.add(shipping_cost.split(",")[1]);
            selected = shipping_cost.split(",")[1];
        } else if (shipping_cost != null && shipping_cost.split(",").length == 1 && !Objects.equals(shipping_cost.split(",")[0],"")) {
            ordoring.add(shipping_cost.split(",")[0]);
            selected = shipping_cost.split(",")[0];
        }else {
            selected = "face-to-face";
        }


        AddressDto buyerAdr = null;
        if (buyer.getAddress() != null) {
            buyerAdr = AddressDto.builder()
                    .city(buyer.getAddress().getCity())
                    .pincode(buyer.getAddress().getPincode())
                    .country(buyer.getAddress().getCountry())
                    .build();
        }

        return PaymentInitResDto.builder()
                .id(purchaseId)
                .item(ItemDto.builder()
                        .id(String.valueOf(ads.getId()))
                        .title(ads.getSubject())
                        .imageUrl(imageName)
                        .prices(PricesDto.builder()
                                .price((int) (ads.getPrice_cents() * 100))
                                .buyer_fees((int) (ads.getPrice_cents() * 100) * 4 / 100)
                                .build())
                        .estimated_weight(355)
                        .build())
                .buyer(BuyerDto.builder()
                        .id(String.valueOf(buyer.getId()))
                        .first_name(buyer.getFirstName())
                        .last_name(buyer.getLastName())
                        .phone_number(buyer.getPhone())
                        .address(buyerAdr)
                        .build())
                .seller(SellerDto.builder()
                        .account_type("private-individual")
                        .name(seller.getFirstName())
                        .build())
                .delivery_modes(DeliveryModesDto.builder()
                        .display(DisplayDto.builder()
                                .ordering(ordoring)
                                .selected(selected)
                                .build())
                        .courrier_suivi(CourrierSuiviDto.builder()
                                .prices(PricesDto.builder()
                                        .price(632)
                                        .build())
                                .build())
                        .face_to_face(FaceToFaceDto.builder()
                                .city(ads.getAddress().getCity())
                                .zipcode(ads.getAddress().getPincode())
                                .build())
                        .mondial_relay(MondialRelayDto.builder()
                                .prices(PricesDto.builder()
                                        .price(349)
                                        .build())
                                .build())
                        .build())
                .build();
    }

    @Override
    public StripeAuthUserResDto stripeAuth(Principal principal, StripeAuthUserReqDto stripeAuthUserReqDto) {

        System.out.println("code: " +stripeAuthUserReqDto.getCode());
        UserEntity user = userService.findUserByEmail(principal.getName());


        Map<String, Object> params = new HashMap<>();
        params.put("grant_type", "authorization_code");
        params.put("code", stripeAuthUserReqDto.getCode());

        TokenResponse response = null;
        try {
            response =  OAuth.token(params, null);
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }


        // Access the connected account ID in the response

        user.setStripeUserId(response.getStripeUserId());

        userService.saveUser(user);

        return StripeAuthUserResDto.builder()
                .stripeUserId(response.getStripeUserId())
                .livemode(response.getLivemode())
                .scope(response.getScope())
                .build();
    }

    @Override
    public EmptyEntity stripeDelete(Principal principal) {
        UserEntity user = userService.findUserByEmail(principal.getName());

        user.setStripeUserId(null);

        userService.saveUser(user);

        return new EmptyEntity();
    }

    @Override
    @Transactional
    public PaymentDto create(Principal principal, PaymentReqDto paymentReqDto) throws StripeException {
        UserEntity buyer = userService.findUserByEmail(principal.getName());
        PaymentEntity payment = getPaymentByPurchaseId(Long.parseLong(paymentReqDto.getPurchaseId()));
        UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found"));

        Customer customer = null;

        if (buyer.getStripeCustomerId() != null) {

            Customer resource = Customer.retrieve(buyer.getStripeCustomerId());
            CustomerUpdateParams params = CustomerUpdateParams.builder()
                            .setSource(paymentReqDto.getToken())
                            .build();
            customer = resource.update(params);
        }else {
            CustomerCreateParams params  = CustomerCreateParams.builder()
                            .setEmail(buyer.getEmail())
                            .setSource(paymentReqDto.getToken())
                            .build();

            customer = Customer.create(params);

            buyer.setStripeCustomerId(customer.getId());
            userService.saveUser(buyer);
        }


        ShippingEntity shipping = null;

        if (!paymentReqDto.getDeliveryMode().equals("face-to-face")) {
            shipping = ShippingEntity.builder()
                    .firstname(paymentReqDto.getShippingAddress().getFirstName())
                    .lastname(paymentReqDto.getShippingAddress().getLastName())
                    .phone(paymentReqDto.getShippingAddress().getPhone())
                    .address(paymentReqDto.getShippingAddress().getAddress())
                    .city(paymentReqDto.getShippingAddress().getCity())
                    .country(paymentReqDto.getShippingAddress().getCountry())
                    .pincode(paymentReqDto.getShippingAddress().getPincode())
                    .build();
        }else {
            shipping = ShippingEntity.builder()
                    .firstname(ads.getUser().getFirstName())
                    .lastname(ads.getUser().getLastName())
                    .phone(ads.getUser().getPhone())
                    .address(ads.getAddress().getStreet())
                    .city(ads.getAddress().getCity())
                    .country(ads.getAddress().getCountry())
                    .pincode(ads.getAddress().getPincode())
                    .build();
        }

        ads.setStatus(Status.purchase);
        adsRepository.save(ads);

        shippingService.saveShipping(shipping);

        // TODO : envoyer une notification au vendeur
       String messageSeller = String.format("La transaction N° #%s a été initiée", payment.getPurchaseId());

       NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

        notificationService.createNotification(notificationToSeller);

        // TODO : envoyer un mail à l'acheteur
        String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

        // Email to seller
        Context context2 = new Context();
        context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
        context2.setVariable("message", messageSeller);

        emailService.sendEmail(seller, subject, "shipping-email", context2);



        payment.setCreatedAt(Timestamp.from(Instant.now()));
        payment.setAmount(Double.parseDouble(paymentReqDto.getAmount()));
        payment.setDelivery_mode(paymentReqDto.getDeliveryMode());
        payment.setBuyer(buyer);
        payment.setShipping(shipping);
        payment.setStatus(PaymentStatus.pending);
        payment.setSteps(new ArrayList<>());
        payment.setRelayId(paymentReqDto.getRelayId());
        paymentRepository.save(payment);


        ShippingStepEntity shippingStep = ShippingStepEntity.builder()
                .step(ShippingStep.one.getValue())
                .expiryDate(getExpirationDate(Timestamp.from(Instant.now()), 2))
                .payment(payment)
                .build();

        shippingStepService.createShippingStep(shippingStep);

        return PaymentDto.builder()
                .id(String.valueOf(payment.getId()))
                .labelUrl(payment.getLabelUrl())
                .build();
    }

    @Override
    public PaymentDto chargeCustomer(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity buyer = userService.getUserById(paymentChargeReqDto.getBuyerId());
        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found"));

        ChargeCreateParams params =
                ChargeCreateParams.builder()
                        .setAmount((long) payment.getAmount() * 100)
                        .setCurrency("eur")
                        .setCustomer(buyer.getStripeCustomerId())
                        .build();

        try {
            Charge charge = Charge.create(params);

            ShippingStepEntity shippingStep = payment.getSteps().stream()
                    .filter(item -> item.getStep().equals(ShippingStep.one.getValue()))
                    .findFirst()
                    .orElse(null);

            if (shippingStep != null) {

                shippingStep.setSelected(paymentChargeReqDto.getSelected());
                shippingStep.setStatus(ShippingStatus.available);
                shippingStep.setExpiryDate(null);
                shippingStepService.createShippingStep(shippingStep);

                ShippingStepEntity shippingNextStep = shippingStepService.createShippingStep(ShippingStepEntity.builder()
                        .step(ShippingStep.two.getValue())
                        .expiryDate(getExpirationDate(Timestamp.from(Instant.now()), 3))
                        .payment(payment)
                        .build());

                List<ShippingStepEntity> list = new ArrayList<>(payment.getSteps());
                list.add(shippingNextStep);

                payment.setSteps(list);
            }

            String labelUrl = null;
            String expNumber = null;

            if (payment.getDelivery_mode().equals("mondial-relay")) {

                CreationEtiquetteReqDto etiquetteReqDto = CreationEtiquetteReqDto.builder()
                        .enseigne("BDTEST13")
                        .modeCol("REL")
                        .modeLiv("24R")
                        .expe_langage("FR")
                        .expe_ad1("MR")
                        .expe_ad3(ads.getAddress().getStreet())
                        .expe_ville(ads.getAddress().getCity())
                        .expe_cp(ads.getAddress().getPincode())
                        .expe_pays("FR")
                        .expe_tel1(ads.getPhone())
                        .dest_langage("FR")
                        .dest_ad1("MR")
                        .dest_ad3(payment.getShipping().getAddress())
                        .dest_ville(payment.getShipping().getCity())
                        .dest_cp(payment.getShipping().getPincode())
                        .dest_pays("FR")
                        .dest_tel1(buyer.getPhone())
                        .poids("10")
                        .nbColis("1")
                        .crt_valeur("0")
                        .col_rel_pays("FR")
                        .col_rel("AUTO")
                        .liv_rel_pays("FR")
                        .liv_rel(payment.getRelayId())
                        .texte(ads.getSubject())
                        .build();

                CreationEtiquetteResDto etiquetteResDto = mondialRelayService.WSI2_CreationEtiquetteSoapIn(etiquetteReqDto);

                if (etiquetteResDto.getStat().equals("0")) {
                    labelUrl = etiquetteResDto.getUrlEtiquette();
                    expNumber = etiquetteResDto.getExpeditionNum();
                }
            }

            payment.setChargeId(charge.getId());
            payment.setLabelUrl(labelUrl);
            payment.setExpNumber(expNumber);

            // TODO : envoyer une notification à l'acheteur
            String messageSeller = String.format("Transaction N° #%s: Votre carte à été débitée d'un montant de %s €", payment.getPurchaseId(), payment.getAmount());

            NotificationEntity notificationToSeller = getNotification(messageSeller, buyer);

            notificationService.createNotification(notificationToSeller);

            // TODO : envoyer un mail l'acheteur
            String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

            // Email to seller
            Context context2 = new Context();
            context2.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
            context2.setVariable("message", messageSeller);

            emailService.sendEmail(buyer, subject, "shipping-email", context2);


            return Payment.toDto(payment);

        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public PaymentDto updateSendPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity seller = userService.findUserByEmail(principal.getName());
        UserEntity buyer = userService.getUserById(paymentChargeReqDto.getBuyerId());
        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));

        if (!payment.getSeller().getId().equals(seller.getId()) || !payment.getBuyer().getId().equals(buyer.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }

        ShippingStepEntity shippingStep = payment.getSteps().stream()
                .filter(item -> item.getStep().equals(ShippingStep.two.getValue()))
                .findFirst()
                .orElse(null);

        if (shippingStep != null) {

            shippingStep.setSelected(paymentChargeReqDto.getSelected());
            shippingStep.setStatus(ShippingStatus.send);
            shippingStep.setExpiryDate(null);
            shippingStepService.updateShippingStep(shippingStep);

            ShippingStepEntity shippingNextStep = ShippingStepEntity.builder()
                    .step(ShippingStep.tree.getValue())
                    .expiryDate(getExpirationDate(Timestamp.from(Instant.now()), 10))
                    .payment(payment)
                    .build();

            shippingStepService.createShippingStep(shippingNextStep);

            List<ShippingStepEntity> list = new ArrayList<>(payment.getSteps());
            list.add(shippingNextStep);

            payment.setSteps(list);
        }

        // TODO : envoyer une notification à l'acheteur
        String message = String.format("La transaction N° #%s: Le colis a été envoyé", payment.getPurchaseId());

        NotificationEntity notificationToSeller = getNotification(message, buyer);

        notificationService.createNotification(notificationToSeller);

        // TODO : envoyer un mail à l'acheteur
        String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

        // Email to seller
        Context context2 = new Context();
        context2.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
        context2.setVariable("message", message);

        emailService.sendEmail(buyer, subject, "shipping-email", context2);

        return Payment.toDto(payment);
    }

    @Override
    public PaymentDto updateReceivePayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity buyer = userService.findUserByEmail(principal.getName());
        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

        if (!payment.getBuyer().getId().equals(buyer.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }

        ShippingStepEntity shippingStep = payment.getSteps().stream()
                .filter(item -> item.getStep().equals(ShippingStep.tree.getValue()))
                .findFirst()
                .orElse(null);

        if (shippingStep != null) {

            shippingStep.setSelected(paymentChargeReqDto.getSelected());
            shippingStep.setStatus(ShippingStatus.receive);
            shippingStep.setExpiryDate(null);
            shippingStepService.updateShippingStep(shippingStep);

            ShippingStepEntity shippingNextStep = ShippingStepEntity.builder()
                    .step(ShippingStep.four.getValue())
                    .expiryDate(getExpirationDate(Timestamp.from(Instant.now()), 3))
                    .payment(payment)
                    .build();

            shippingStepService.createShippingStep(shippingNextStep);

            List<ShippingStepEntity> list = new ArrayList<>(payment.getSteps());
            list.add(shippingNextStep);

            payment.setSteps(list);

        }

        // TODO : envoyer une notification au vendeur
        String messageSeller = String.format("La transaction N° #%s: le colis à bien été reception par l'acheteur.", payment.getPurchaseId());

        NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

        notificationService.createNotification(notificationToSeller);

        // TODO : envoyer un mail au vendeur et à l'acheteur
        String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

        // Email to seller
        Context context2 = new Context();
        context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
        context2.setVariable("message", messageSeller);

        emailService.sendEmail(seller, subject, "shipping-email", context2);

        return Payment.toDto(payment);
    }

    @Override
    public PaymentDto updatePaidPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity buyer = userService.findUserByEmail(principal.getName());
        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));
        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found!"));

        if (!payment.getBuyer().getId().equals(buyer.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }



        TransferCreateParams params =
                TransferCreateParams.builder()
                        .setAmount((long) (payment.getAmount() - 1) * 100)
                        .setCurrency("eur")
                        .setDestination(seller.getStripeUserId())
                        .build();
        try {
            Transfer transfer = Transfer.create(params);

            ShippingStepEntity shippingStep = payment.getSteps().stream()
                    .filter(item -> item.getStep().equals(ShippingStep.four.getValue()))
                    .findFirst()
                    .orElse(null);

            if (shippingStep != null) {

                shippingStep.setSelected(paymentChargeReqDto.getSelected());
                shippingStep.setStatus(ShippingStatus.paid);
                shippingStep.setExpiryDate(null);
                shippingStepService.createShippingStep(shippingStep);

                payment.setStatus(PaymentStatus.paid);
            }

            ads.setStatus(Status.sold);
            adsRepository.save(ads);

            // TODO : envoyer une notification au vendeur
            String messageSeller = String.format("La transaction N° #%s: un paiment d'un montant de %s € vous a été envoyé.", payment.getPurchaseId(), payment.getAmount() - 3);

            NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

            notificationService.createNotification(notificationToSeller);

            // TODO : envoyer un mail au vendeur et à l'acheteur
            String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

            // Email to seller
            Context context2 = new Context();
            context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
            context2.setVariable("message", messageSeller);

            emailService.sendEmail(seller, subject, "shipping-email", context2);


            return Payment.toDto(payment);

        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public PaymentDto cancelPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity seller = userService.findUserByEmail(principal.getName());
        UserEntity buyer = userService.getUserById(paymentChargeReqDto.getBuyerId());

        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found!"));

        if (!payment.getSeller().getId().equals(seller.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }

        ShippingStepEntity step = payment.getSteps().stream()
                .filter(item -> item.getStep().equals(ShippingStep.one.getValue()))
                .findFirst()
                .orElse(null);

        if (step != null) {
            step.setStatus(ShippingStatus.cancel);
            payment.setStatus(PaymentStatus.cancel);
            step.setExpiryDate(null);
            step.setSelected(paymentChargeReqDto.getSelected());

            shippingStepService.updateShippingStep(step);
            paymentRepository.save(payment);

            ads.setStatus(Status.delete);
            adsRepository.save(ads);

        }

        // TODO : envoyer une notification au vendeur
        String message = String.format("La transaction N° #%s a été annulée.", payment.getPurchaseId());

        NotificationEntity notification = getNotification(message, buyer);

        notificationService.createNotification(notification);

        // TODO : envoyer un mail l'acheteur
        String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

        // Email to seller
        Context context2 = new Context();
        context2.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
        context2.setVariable("message", message);

        emailService.sendEmail(buyer, subject, "shipping-email", context2);


        return Payment.toDto(payment);
    }

    @Override
    public PaymentDto suspendPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity buyer = userService.findUserByEmail(principal.getName());
        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

        if (!payment.getBuyer().getId().equals(buyer.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }

        ShippingStepEntity step = payment.getSteps().stream()
                .filter(item -> item.getStep().equals(paymentChargeReqDto.getStep()))
                .findFirst()
                .orElse(null);

        if (step != null) {
            step.setStatus(ShippingStatus.suspend);
            payment.setStatus(PaymentStatus.suspend);

            if (paymentChargeReqDto.getStep().equals(ShippingStep.tree.getValue())) {
                step.setSelected("Non, je n'ai pas reçu le colis");
                step.setExpiryDate(null);
            }else {
                step.setSelected("Non, j'ai un problème");
                step.setExpiryDate(getExpirationDate(Timestamp.from(Instant.now()), 7));

                ShippingStepEntity shippingNextStep = shippingStepService.createShippingStep(ShippingStepEntity.builder()
                        .step(ShippingStep.five.getValue())
                        .payment(payment)
                        .build());

                List<ShippingStepEntity> list = new ArrayList<>(payment.getSteps());
                list.add(shippingNextStep);

                payment.setSteps(list);
            }

            shippingStepService.updateShippingStep(step);
            paymentRepository.save(payment);
        }

        // TODO : envoyer une notification à l'acheteur
        String message = String.format("La transaction N° #%s a été suspendue.", payment.getPurchaseId());

        NotificationEntity notification = getNotification(message, seller);

        notificationService.createNotification(notification);

        // TODO : envoyer un mail au vendeur
        String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

        // Email to seller
        Context context2 = new Context();
        context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
        context2.setVariable("message", message);

        emailService.sendEmail(seller, subject, "shipping-email", context2);

        return Payment.toDto(payment);
    }

    @Override
    public EmptyEntity refundPayment(Principal principal, PaymentChargeReqDto paymentChargeReqDto) {
        UserEntity seller = userService.findUserByEmail(principal.getName());
        UserEntity buyer = userService.getUserById(paymentChargeReqDto.getBuyerId());

        PaymentEntity payment = getPaymentById(UUID.fromString(paymentChargeReqDto.getPaymentId()));
        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Not found!"));

        if (!payment.getSeller().getId().equals(seller.getId())) {
            throw new ResourceNotFoundException("Your are not allowed!");
        }

        RefundCreateParams params =
                RefundCreateParams.builder()
                        .setCharge(payment.getChargeId())
                        .build();
           try {

               Refund refund = Refund.create(params);

              /* ShippingStepEntity prevStep = payment.getSteps().stream()
                       .filter(item -> item.getStep().equals(ShippingStep.four.getValue()))
                       .findFirst()
                       .orElse(null);

               ShippingStepEntity step = payment.getSteps().stream()
                       .filter(item -> item.getStep().equals(ShippingStep.five.getValue()))
                       .findFirst()
                       .orElse(null);

               if (prevStep != null) {
                   prevStep.setExpiryDate(null);
                   shippingStepService.updateShippingStep(prevStep);
               }

               if (step != null) {
                   step.setStatus(ShippingStatus.refund);
                   payment.setStatus(PaymentStatus.cancel);

                   step.setSelected(paymentChargeReqDto.getSelected());


                   shippingStepService.updateShippingStep(step);
                   paymentRepository.save(payment);
               }*/

               // TODO : envoyer une notification à l'acheteur
               String message = String.format("La transaction N° #%s: votre remboursement d'un montant de %s € a été effectué", payment.getPurchaseId(), payment.getAmount());

               NotificationEntity notification = getNotification(message, buyer);

               notificationService.createNotification(notification);

               // TODO : envoyer un mail l'acheteur
               String subject = String.format("Transaction N° #%s", payment.getPurchaseId());

               // Email to seller
               Context context2 = new Context();
               context2.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
               context2.setVariable("message", message);

               emailService.sendEmail(buyer, subject, "shipping-email", context2);


               deletePayment(payment.getId());



               return new EmptyEntity();

          } catch (StripeException e) {
              throw new RuntimeException(e);
          }
    }

    @Override
    @Transactional
    public EmptyEntity deletePayment(UUID id) {
        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found!"));

        AdsEntity ads = adsRepository.findAdsEntityByPayment(payment.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Ads not found!"));


        payment.setStatus(PaymentStatus.init);
        payment.setDelivery_mode(null);
        payment.setCreatedAt(null);
        payment.setLabelUrl(null);
        payment.setChargeId(null);
        payment.setAmount(0);
        payment.setBuyer(null);
        payment.setShipping(null);
        paymentRepository.save(payment);

       payment.getSteps().forEach(step -> {
            shippingStepService.deleteShippingStep(step.getId());
        });

       ads.setStatus(Status.active);
       adsRepository.save(ads);

        return new EmptyEntity();
    }


    @Scheduled(cron = "${purge.cron.expression}")
    public void checkExpirePaymentStep() {
        List<PaymentEntity> payments = (List<PaymentEntity>) paymentRepository.findAll();

        payments.forEach(payment -> {

            if (!payment.getStatus().equals(PaymentStatus.cancel) && payment.getSteps().size() == 1) {
                ShippingStepEntity step = payment.getSteps().get(0);
                if (step.getExpiryDate() != null && Timestamp.from(Instant.now()).getTime() > step.getExpiryDate().getTime() ) {
                    // TODO : annuler la transaction
                    UserEntity buyer = userService.getUserById(String.valueOf(payment.getBuyer().getId()));
                    UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

                    step.setStatus(ShippingStatus.cancel);
                    step.setSelected("Non, le bien n'est plus disponible");
                    payment.setStatus(PaymentStatus.cancel);
                    step.setExpiryDate(null);

                    shippingStepService.createShippingStep(step);
                    paymentRepository.save(payment);

                    // TODO : modifier le status de l'ads à delete

                    AdsEntity ads = payment.getAds();

                    ads.setStatus(Status.delete);

                    adsRepository.save(ads);

                    // TODO : envoyer une notification au vendeur et à l'acheteur
                    String message = String.format("La transaction N° #%s a été automatiquement annulée", payment.getPurchaseId());
                    NotificationEntity notificationToBuyer = getNotification(message, buyer);
                    NotificationEntity notificationToSeller = getNotification(message, seller);

                    notificationService.createNotification(notificationToBuyer);
                    notificationService.createNotification(notificationToSeller);

                    // TODO : envoyer un mail au vendeur et à l'acheteur
                    String subject = String.format("Transaction N° #%s", payment.getPurchaseId());
                    // Email to buyer
                    Context context1 = new Context();
                    context1.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
                    context1.setVariable("message", message);

                    emailService.sendEmail(buyer, subject, "shipping-email", context1);

                    // Email to seller
                    Context context2 = new Context();
                    context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
                    context2.setVariable("message", message);

                    // emailService.sendEmail(seller, subject, "shipping-email", context2);
                }
            }

            if (!payment.getStatus().equals(PaymentStatus.cancel) && payment.getSteps().size() == 2) {
                ShippingStepEntity step = payment.getSteps().stream()
                        .filter(item -> item.getStep().equals(ShippingStep.two.getValue()))
                        .findFirst()
                        .orElse(null);

                if (step != null && step.getExpiryDate() != null && Timestamp.from(Instant.now()).getTime() > step.getExpiryDate().getTime()) {
                    UserEntity buyer = userService.getUserById(String.valueOf(payment.getBuyer().getId()));
                    UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

                    // TODO :  procéder au remboursement du client

                    RefundCreateParams params =
                            RefundCreateParams.builder()
                                    .setCharge(payment.getChargeId())
                                    .build();
                       try {
                         Refund refund = Refund.create(params);

                         step.setStatus(ShippingStatus.refund);
                         step.setExpiryDate(null);
                         payment.setStatus(PaymentStatus.refund);

                      } catch (StripeException e) {
                          throw new RuntimeException(e);
                      }

                    // TODO : réinitialiser la transaction

                    deletePayment(payment.getId());

                    // TODO : envoyer une notification au vendeur et à l'acheteur
                    String messageBuyer = String.format("La transaction N° #%s a été automatiquement annulée et nous avont procédé à votre remboursement", payment.getPurchaseId());
                    String messageSeller = String.format("La transaction N° #%s a été automatiquement annulée", payment.getPurchaseId());

                    NotificationEntity notificationToBuyer = getNotification(messageBuyer, buyer);
                    NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

                    notificationService.createNotification(notificationToBuyer);
                    notificationService.createNotification(notificationToSeller);

                    // TODO : envoyer un mail au vendeur et à l'acheteur
                    String subject = String.format("Transaction N° #%s", payment.getPurchaseId());
                    // Email to buyer
                    Context context1 = new Context();
                    context1.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
                    context1.setVariable("message", messageBuyer);

                     emailService.sendEmail(buyer, subject, "shipping-email", context1);

                    // Email to seller
                    Context context2 = new Context();
                    context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
                    context2.setVariable("message", messageSeller);

                     emailService.sendEmail(seller, subject, "shipping-email", context2);

                }
            }

            if (!payment.getStatus().equals(PaymentStatus.cancel) && payment.getSteps().size() == 3) {

                ShippingStepEntity step = payment.getSteps().stream()
                        .filter(item -> item.getStep().equals(ShippingStep.tree.getValue()))
                        .findFirst()
                        .orElse(null);

                if (step != null && step.getStatus() != null && !step.getStatus().equals(ShippingStatus.suspend) && step.getExpiryDate() != null && Timestamp.from(Instant.now()).getTime() - step.getExpiryDate().getTime() > 0) {
                    UserEntity buyer = userService.getUserById(String.valueOf(payment.getBuyer().getId()));
                    UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

                    // TODO : suspendre le payment
                    step.setStatus(ShippingStatus.suspend);
                    step.setSelected("Non, je n'ai pas reçu le colis");
                    step.setExpiryDate(null);
                    payment.setStatus(PaymentStatus.suspend);

                    shippingStepService.updateShippingStep(step);
                    paymentRepository.save(payment);

                    // TODO : envoyer une notification au vendeur et à l'acheteur
                    String messageBuyer = String.format("La transaction N° #%s a été automatiquement suspendue. Veuillez prendre attache dans un premier temps avec le transporteur", payment.getPurchaseId());
                    String messageSeller = String.format("La transaction N° #%s a été automatiquement suspendue", payment.getPurchaseId());

                    NotificationEntity notificationToBuyer = getNotification(messageBuyer, buyer);
                    NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

                    notificationService.createNotification(notificationToBuyer);
                    notificationService.createNotification(notificationToSeller);

                    // TODO : envoyer un mail au vendeur et à l'acheteur
                    String subject = String.format("Transaction N° #%s", payment.getPurchaseId());
                    // Email to buyer
                    Context context1 = new Context();
                    context1.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
                    context1.setVariable("message", messageBuyer);

                    //  emailService.sendEmail(buyer, subject, "shipping-email", context1);

                    // Email to seller
                    Context context2 = new Context();
                    context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
                    context2.setVariable("message", messageSeller);

                    // emailService.sendEmail(seller, subject, "shipping-email", context2);
                }
            }

            if (!payment.getStatus().equals(PaymentStatus.cancel) && payment.getSteps().size() == 4) {

                ShippingStepEntity step = payment.getSteps().stream()
                        .filter(item -> item.getStep().equals(ShippingStep.four.getValue()))
                        .findFirst()
                        .orElse(null);

                if (step != null && step.getExpiryDate() != null && Timestamp.from(Instant.now()).getTime() - step.getExpiryDate().getTime() > 0 && step.getStatus() == null) {
                    UserEntity buyer = userService.getUserById(String.valueOf(payment.getBuyer().getId()));
                    UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));
                    // TODO : procéder au payment du vendeur

                    TransferCreateParams params =
                            TransferCreateParams.builder()
                                    .setAmount((long) (payment.getAmount() - 1) * 100)
                                    .setCurrency("eur")
                                    .setDestination(seller.getStripeUserId())
                                    .build();

                    step.setStatus(ShippingStatus.paid);
                    step.setSelected("Oui, tout est ok");
                    step.setExpiryDate(null);
                    payment.setStatus(PaymentStatus.paid);

                    shippingStepService.createShippingStep(step);
                    paymentRepository.save(payment);

                    // TODO : modifier le status de l'ads à delete

                    AdsEntity ads = payment.getAds();

                    ads.setStatus(Status.sold);

                    adsRepository.save(ads);

                    // TODO : envoyer une notification au vendeur et à l'acheteur
                    String messageBuyer = String.format("La transaction N° #%s a été automatiquement finalisée et le vendeur payé", payment.getPurchaseId());
                    String messageSeller = String.format("La transaction N° #%s a été automatiquement finalisée et votre paiement effectué", payment.getPurchaseId());

                    NotificationEntity notificationToBuyer = getNotification(messageBuyer, buyer);
                    NotificationEntity notificationToSeller = getNotification(messageSeller, seller);

                    notificationService.createNotification(notificationToBuyer);
                    notificationService.createNotification(notificationToSeller);

                    // TODO : envoyer un mail au vendeur et à l'acheteur
                    String subject = String.format("Transaction N° #%s", payment.getPurchaseId());
                    // Email to buyer
                    Context context1 = new Context();
                    context1.setVariable("name", buyer.getFirstName() + " " + buyer.getLastName());
                    context1.setVariable("message", messageBuyer);

                    emailService.sendEmail(buyer, subject, "shipping-email", context1);

                    // Email to seller
                    Context context2 = new Context();
                    context2.setVariable("name", seller.getFirstName() + " " + seller.getLastName());
                    context2.setVariable("message", messageSeller);

                    emailService.sendEmail(seller, subject, "shipping-email", context2);
                }

                if (step != null && step.getExpiryDate() != null && Timestamp.from(Instant.now()).getTime() - step.getExpiryDate().getTime() > 0 && step.getStatus().equals(ShippingStatus.suspend)) {
                    UserEntity buyer = userService.getUserById(String.valueOf(payment.getBuyer().getId()));
                    //UserEntity seller = userService.getUserById(String.valueOf(payment.getSeller().getId()));

                    // TODO : contacter l'équipe sandaga

                    step.setExpiryDate(null);

                    contactService.createContact(ContactDto.builder()
                            .email(buyer.getEmail())
                            .firstName(buyer.getFirstName())
                            .lastName(buyer.getLastName())
                            .phone(buyer.getPhone())
                            .type("Litige")
                            .purchaseId(String.valueOf(payment.getPurchaseId()))
                            .build());

                    shippingStepService.updateShippingStep(step);
                }

            }
        });
    }

    private NotificationEntity getNotification(String message, UserEntity user) {
        return NotificationEntity.builder()
                .message(message)
                .createdAt(Timestamp.from(Instant.now()))
                .status(NotificationStatus.pending)
                .user(user)
                .build();
    }

    private Timestamp getExpirationDate(Timestamp date, int days) {

        Calendar cal = Calendar.getInstance();
        cal.setTime(date);// w ww.  j ava  2  s  .co m
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        //cal.add(Calendar.MINUTE, days);
        return new Timestamp(cal.getTime().getTime());
    }
}
