import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-white overflow-hidden shadow rounded-lg border border-gray-100", className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
    return <div className={cn("px-4 py-5 sm:px-6 border-b border-gray-100", className)}>{children}</div>;
}

const CardBody = ({ children, className }) => {
    return <div className={cn("px-4 py-5 sm:p-6", className)}>{children}</div>;
}

const CardFooter = ({ children, className }) => {
    return <div className={cn("px-4 py-4 sm:px-6 border-t border-gray-100 bg-gray-50", className)}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
