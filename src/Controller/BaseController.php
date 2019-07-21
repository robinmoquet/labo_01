<?php


namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationType;
use App\Form\UserType;
use Doctrine\Common\Persistence\ObjectManager;
use Parsedown;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class BaseController
 * @package App\Controller
 */
class BaseController extends AbstractController
{

    /**
     * @var ObjectManager
     */
    private $manager;

    public function __construct(ObjectManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @Route("/", name="home")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request, UserPasswordEncoderInterface $encoder)
    {
        if($this->isGranted('IS_AUTHENTICATED_FULLY')) return $this->redirectToRoute('messages');

        $user = new User();
        $form = $this->createForm(RegistrationType::class, $user);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()) {
            dump($form->get('password'));
            $user->setPassword($encoder->encodePassword($user, $form->get('password')->getData()));

            $this->manager->persist($user);
            $this->manager->flush();
            return $this->redirectToRoute("login");
        }

        return $this->render("connection/registration.html.twig", [
            "form" => $form->createView()
        ]);
    }

    /**
     * @Route("/login", name="login")
     * @param Request $request
     * @param AuthenticationUtils $authenticationUtils
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function login(Request $request, AuthenticationUtils $authenticationUtils)
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        dump($error);

        return $this->render("connection/login.html.twig", [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }

    /**
     * @Route("/readme", name="readme")
     */
    public function readme()
    {
        return $this->render("readme.html.twig");
    }

    /**
     * @Route("/readme-md", name="readme-md")
     */
    public function readmeMd()
    {
        $fileMd = file_get_contents("./../README.md");
        $Parsedown = new Parsedown();
        $md = $Parsedown->text($fileMd);
        return $this->render("readme-md.html.twig", ['md' => $md]);
    }

}