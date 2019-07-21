<?php


namespace App\Controller;


use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use App\Service\MercureJwtGenerator;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class MessageController extends AbstractController
{

    /**
     * @var ObjectManager
     */
    private $manager;
    /**
     * @var MessageRepository
     */
    private $messageRepository;
    /**
     * @var Serializer
     */
    private $serializer;

    public function __construct(ObjectManager $manager, MessageRepository $messageRepository)
    {
        $this->manager = $manager;
        $this->messageRepository = $messageRepository;

        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @Route("/messages", name="messages")
     * @param UserRepository $userRepository
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function messages(UserRepository $userRepository, MercureJwtGenerator $mercureJwtGenerator)
    {
        $users = $userRepository->findAll();
        $token = $mercureJwtGenerator->generate($this->getUser());
        $response = $this->render("messages/layout.html.twig", [
            'token' => $_ENV['MERCURE_JWT_SECRET'],
            'users' => $users
        ]);
        $response->headers->set('set-cookie', $token);
        return $response;
    }

    /**
     * @Route("/message/send/{emailReceiver}", name="send_message", methods={"POST"})
     * @param $emailReceiver
     * @param Request $request
     * @param UserRepository $userRepository
     * @return JsonResponse
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function sendMessage($emailReceiver, Request $request, UserRepository $userRepository, Publisher $publisher)
    {
        $receiver = $userRepository->findOneBy(["email" => $emailReceiver]);
        if($receiver === null) return new JsonResponse(["status" => "error"]);
        $sender = $this->getUser();
        $content = $request->getContent();

        $message = new Message();
        $message
            ->setContent($content)
            ->setCreateAt(new \DateTime("now"))
            ->setStatus("Envoyé")
            ->setReceiver($receiver)
            ->setSender($sender);

        $this->manager->persist($message);
        $this->manager->flush();

        $update = new Update(
            'http://labo-01.com/message/send',
            $this->serializer->serialize($message, "json"),
            ["http://localhost:3000/user/{$receiver->getEmail()}"]
        );

        $publisher($update);

        return new JsonResponse(["status" => "success", "message" => $this->serializer->normalize($message)]);
    }

    /**
     * @Route("/messages/{email}")
     * @param $email
     * @param UserRepository $userRepository
     * @return JsonResponse|Response
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function getMessages($email, UserRepository $userRepository)
    {
        $receiver = $userRepository->findOneBy(["email" => $email]);
        if($receiver === null) return new JsonResponse(["status" => "error"], 400);
        $messages = $this->messageRepository->getConversation($this->getUser()->getId(), $receiver->getId());
        $aMessages = $this->serializer->normalize($messages, null, ['ignored_attributes' => ['sender']]);
        dump($aMessages);
        return new JsonResponse($aMessages);
    }

}