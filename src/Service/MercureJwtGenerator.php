<?php


namespace App\Service;


use App\Entity\User;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;

class MercureJwtGenerator
{
    /**
     * @var string
     */
    private $secret;

    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }

    public function generate(User $user)
    {
        $token = (new Builder())
            ->withClaim('mercure', ["subscribe" => [GlobalParameters::MERCURE_URL . "user/{$user->getEmail()}"]])
            ->getToken(new Sha256(), new Key($this->secret));

        return "mercureAuthorization={$token}; Path=/hub; HttpOnly;";
    }
}